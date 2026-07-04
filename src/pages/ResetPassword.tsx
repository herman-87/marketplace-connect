import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { validateResetToken, resetPassword } from "@/lib/passwordReset";

type Status = "validating" | "valid" | "invalid" | "success";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [status, setStatus] = useState<Status>("validating");
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    validateResetToken(token).then(({ valid, email }) => {
      setStatus(valid ? "valid" : "invalid");
      setEmail(email);
    });
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("8 caractères minimum");
    if (password !== confirm) return toast.error("Les mots de passe ne correspondent pas");
    setLoading(true);
    try {
      await resetPassword(token, password);
      setStatus("success");
      toast.success("Mot de passe mis à jour");
    } catch {
      setStatus("invalid");
      toast.error("Lien invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {status === "validating" && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Vérification du lien...</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">Lien invalide ou expiré</h1>
              <p className="text-sm text-muted-foreground">
                Ce lien n'est plus valide. Demandez un nouveau lien de réinitialisation.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Demander un nouveau lien</Link>
            </Button>
          </div>
        )}

        {status === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">Mot de passe réinitialisé</h1>
              <p className="text-sm text-muted-foreground">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>
            <Button className="w-full" onClick={() => navigate("/auth")}>
              Se connecter
            </Button>
          </div>
        )}

        {status === "valid" && (
          <>
            <div>
              <h1 className="text-2xl font-semibold">Nouveau mot de passe</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {email ? (
                  <>
                    Pour <span className="font-medium text-foreground">{email}</span>
                  </>
                ) : (
                  "Choisissez un nouveau mot de passe sécurisé."
                )}
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirmer</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
