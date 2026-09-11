import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon, X } from "lucide-react";
import { useBusinessTags } from "@/hooks/use-business-tags";

/** Tous les tags d'un business : liste, création, suppression */
export function BusinessTagsManager({ businessId }: { businessId: string }) {
  const { tags, loading, createTag, deleteTag } = useBusinessTags(businessId);
  const [name, setName] = useState("");

  const handleCreate = async () => {
    const created = await createTag(name);
    if (created) setName("");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-primary" />
          Tags du business
        </h3>
        <span className="text-xs text-muted-foreground">{tags.length} tag(s)</span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nom du tag"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
          }}
          className="h-9 flex-1"
        />
        <Button size="sm" className="h-9 gap-1.5" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : tags.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun tag. Créez vos premiers tags pour organiser vos produits.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="h-7 gap-1.5 pl-3 pr-1.5 text-xs">
              {tag.name}
              <button
                type="button"
                aria-label={`Supprimer le tag ${tag.name}`}
                onClick={() => deleteTag(tag.id)}
                className="rounded-full p-0.5 hover:bg-muted"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
