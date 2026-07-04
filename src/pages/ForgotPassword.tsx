import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail, Copy } from "lucide-react";
import { forgotPassword } from "@/lib/passwordReset";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [previewLink, setPreviewLink] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await forgotPassword(email);
      const link = `${window.location.origin}/reset-password?token=${token}`;
      setPreviewLink(link);
      setSent(true);
      toast.success("Email envoyé");
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!previewLink) return;
    navigator.clipboard.writeText(previewLink);
    toast.success("Lien copié");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <h1 className="text-2xl font-semibold">Mot de passe oublié</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Entrez votre email, nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <p className="font-medium">Vérifiez votre boîte mail</p>
              <p className="text-sm text-muted-foreground">
                Si un compte existe pour{" "}
                <span className="font-medium text-foreground">{email}</span>, un lien a été envoyé.
              </p>
            </div>

            {previewLink && (
              <div className="rounded-md border border-dashed p-3 space-y-2 bg-muted/30">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Aperçu prototype
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate text-xs">{previewLink}</code>
                  <Button size="icon" variant="ghost" onClick={copy} className="h-7 w-7">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Link
                  to={`/reset-password?token=${previewLink.split("token=")[1]}`}
                  className="text-xs text-foreground underline"
                >
                  Ouvrir le lien →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Vous vous souvenez ?{" "}
              <Link to="/auth" className="underline text-foreground">
                Se connecter
              </Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
