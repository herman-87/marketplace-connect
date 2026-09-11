import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Plus, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusinessTags } from "@/hooks/use-business-tags";

interface TagSelectorProps {
  businessId: string;
  selected: string[];
  onChange: (tagIds: string[]) => void;
}

/** Sélection multiple de tags + création rapide, pour le formulaire produit */
export function TagSelector({ businessId, selected, onChange }: TagSelectorProps) {
  const { tags, loading, createTag } = useBusinessTags(businessId);
  const [newTag, setNewTag] = useState("");

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id]);

  const handleCreate = async () => {
    const created = await createTag(newTag);
    if (created) {
      setNewTag("");
      onChange([...selected, created.id]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold flex items-center gap-2">
        <TagIcon className="w-4 h-4 text-primary" />
        Tags
      </Label>

      <div className="flex gap-2">
        <Input
          placeholder="Nouveau tag (ex: Promo, Nouveauté)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
          }}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" className="gap-1.5 h-10" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Créer
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement des tags…</p>
      ) : tags.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-dashed border-border rounded-lg px-4 py-6 text-center">
          Aucun tag pour ce business. Créez-en un pour classer vos produits.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selected.includes(tag.id);
            return (
              <button key={tag.id} type="button" onClick={() => toggle(tag.id)}>
                <Badge
                  variant={active ? "default" : "outline"}
                  className={cn("gap-1 cursor-pointer h-7 px-3 text-xs", !active && "hover:border-foreground/40")}
                >
                  {active && <Check className="w-3 h-3" />}
                  {tag.name}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
