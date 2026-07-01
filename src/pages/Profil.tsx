import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "user_profile_v1";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
};

export default function Profil() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: user?.email ?? "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setProfile((p) => ({ ...p, ...JSON.parse(raw) }));
      } catch {}
    }
  }, []);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    toast.success("Profil enregistré");
  };

  const initials = profile.fullName
    ? profile.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : (profile.email?.[0] ?? "U").toUpperCase();

  return (
    <AppLayout title="Mon profil" subtitle="Gérez vos informations personnelles">
      <div className="max-w-2xl animate-fade-in">
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90"
                aria-label="Changer l'avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            <div>
              <p className="font-medium">{profile.fullName || "Nom non renseigné"}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Ex: Fatou Diop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+221 77 000 00 00"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={save} className="gap-2">
              <Save className="h-4 w-4" /> Enregistrer
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
