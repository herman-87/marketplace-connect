import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BusinessTag {
  id: string;
  name: string;
}

/** Tags d'un business : liste, création, suppression */
export function useBusinessTags(businessId: string) {
  const [tags, setTags] = useState<BusinessTag[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("business_tags")
      .select("id, name")
      .eq("business_id", businessId)
      .order("name", { ascending: true });
    if (error) {
      toast.error("Impossible de charger les tags");
    } else {
      setTags(data ?? []);
    }
    setLoading(false);
  }, [businessId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTag = useCallback(
    async (rawName: string): Promise<BusinessTag | null> => {
      const name = rawName.trim();
      if (!name) {
        toast.error("Le nom du tag est requis");
        return null;
      }
      if (name.length > 40) {
        toast.error("40 caractères maximum");
        return null;
      }
      if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
        toast.error("Ce tag existe déjà");
        return null;
      }
      const { data, error } = await supabase
        .from("business_tags")
        .insert({ business_id: businessId, name })
        .select("id, name")
        .single();
      if (error || !data) {
        toast.error(
          error?.code === "23505" ? "Ce tag existe déjà" : "Connectez-vous pour créer un tag"
        );
        return null;
      }
      setTags((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success(`Tag « ${data.name} » créé`);
      return data;
    },
    [businessId, tags]
  );

  const deleteTag = useCallback(async (tagId: string) => {
    const { error } = await supabase.from("business_tags").delete().eq("id", tagId);
    if (error) {
      toast.error("Suppression impossible");
      return false;
    }
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    toast.success("Tag supprimé");
    return true;
  }, []);

  return { tags, loading, refresh, createTag, deleteTag };
}

/** Tags associés à un produit */
export async function fetchProductTagIds(productId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("product_tags")
    .select("tag_id")
    .eq("product_id", productId);
  if (error || !data) return [];
  return data.map((r) => r.tag_id);
}

/** Remplace la liste des tags d'un produit */
export async function saveProductTags(
  businessId: string,
  productId: string,
  tagIds: string[]
): Promise<boolean> {
  const { error: delError } = await supabase
    .from("product_tags")
    .delete()
    .eq("product_id", productId);
  if (delError) return false;
  if (tagIds.length === 0) return true;
  const { error } = await supabase.from("product_tags").insert(
    tagIds.map((tag_id) => ({ business_id: businessId, product_id: productId, tag_id }))
  );
  return !error;
}
