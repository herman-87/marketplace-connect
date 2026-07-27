import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";

type OauthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = (supabase.auth as unknown as { oauth: OauthNamespace }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Paramètre authorization_id manquant");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Aucune redirection renvoyée par le serveur d'autorisation.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          {error ? (
            <>
              <h1 className="text-lg font-semibold">Demande d'autorisation invalide</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
            </>
          ) : !details ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement…
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-semibold">
                Connecter {details.client?.name ?? "une application"} à votre compte
              </h1>
              <p className="text-sm text-muted-foreground">
                Cette application pourra utiliser FastRelays en votre nom : consulter vos
                produits et commandes, et échanger des messages sur vos commandes.
              </p>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                  Autoriser
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={busy}
                  onClick={() => decide(false)}
                >
                  Refuser
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
