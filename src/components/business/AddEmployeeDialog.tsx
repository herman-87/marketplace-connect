import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Package, ShoppingCart, Megaphone, BarChart3, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  email?: string;
}

type EmployeeRole = "PRODUCT_MANAGER" | "ORDER_MANAGER" | "ADVERT_MANAGER" | "SONDAGE_MANAGER";

interface RoleOption {
  id: EmployeeRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "PRODUCT_MANAGER",
    label: "Produits",
    description: "Gérer les produits et le catalogue",
    icon: Package,
  },
  {
    id: "ORDER_MANAGER",
    label: "Commandes",
    description: "Traiter et suivre les commandes",
    icon: ShoppingCart,
  },
  {
    id: "ADVERT_MANAGER",
    label: "Publicités",
    description: "Créer et gérer les campagnes",
    icon: Megaphone,
  },
  {
    id: "SONDAGE_MANAGER",
    label: "Sondages",
    description: "Créer et analyser les sondages",
    icon: BarChart3,
  },
];

// Mock function to simulate user search - accepts any username for testing
const searchUserByUsername = async (username: string): Promise<UserProfile | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For testing: create a user profile from any username entered
  const sanitizedUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
  
  return {
    id: `user_${Date.now()}`,
    username: sanitizedUsername,
    name: username.trim().split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sanitizedUsername}`,
    email: `${sanitizedUsername}@example.com`
  };
};

interface AddEmployeeDialogProps {
  onAddEmployee?: (userId: string, roles: EmployeeRole[]) => void;
}

export function AddEmployeeDialog({ onAddEmployee }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<EmployeeRole[]>([]);

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    setFoundUser(null);
    setSelectedRoles([]);
    
    try {
      const user = await searchUserByUsername(username.trim());
      if (user) {
        setFoundUser(user);
      } else {
        setSearchError("Aucun utilisateur trouvé avec ce nom d'utilisateur");
      }
    } catch (error) {
      setSearchError("Erreur lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleRole = (roleId: EmployeeRole) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleAddEmployee = () => {
    if (foundUser && selectedRoles.length > 0) {
      onAddEmployee?.(foundUser.id, selectedRoles);
      // Reset state
      setOpen(false);
      setUsername("");
      setFoundUser(null);
      setSelectedRoles([]);
      setSearchError(null);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog closes
      setUsername("");
      setFoundUser(null);
      setSelectedRoles([]);
      setSearchError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un employé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rechercher par nom d'utilisateur</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ex: john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !username.trim()}
                variant="secondary"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Chercher"
                )}
              </Button>
            </div>
            {searchError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="h-3 w-3" />
                {searchError}
              </p>
            )}
          </div>

          {/* Found User Profile */}
          {foundUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-foreground/30 transition-colors bg-muted/30">
                <Avatar className="h-14 w-14 border-2 border-foreground/20">
                  <AvatarImage src={foundUser.avatar} />
                  <AvatarFallback className="bg-muted text-foreground text-lg">
                    {foundUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{foundUser.name}</p>
                  <p className="text-sm text-muted-foreground">@{foundUser.username}</p>
                  {foundUser.email && (
                    <p className="text-xs text-muted-foreground">{foundUser.email}</p>
                  )}
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  Trouvé
                </Badge>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Sélectionner les rôles</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRoles.includes(role.id);
                    
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                          "hover:border-foreground/30",
                          isSelected 
                            ? "border-foreground bg-muted/50" 
                            : "border-border bg-background"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-foreground flex items-center justify-center">
                            <Check className="h-3 w-3 text-background" />
                          </div>
                        )}
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          isSelected ? "bg-foreground/10" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            isSelected ? "text-foreground" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="text-center">
                          <p className={cn(
                            "font-medium text-sm",
                            isSelected && "text-foreground"
                          )}>
                            {role.label}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {role.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Button */}
              <Button 
                onClick={handleAddEmployee}
                disabled={selectedRoles.length === 0}
                className="w-full gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Ajouter avec {selectedRoles.length} rôle{selectedRoles.length > 1 ? "s" : ""}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
