import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { mockProducts } from "../../../data/businessMockData";

export default defineTool({
  name: "list_products",
  title: "Lister les produits",
  description:
    "Liste les produits de la boutique avec leur prix, stock et statut. Un filtre texte optionnel permet de chercher par nom ou catégorie.",
  inputSchema: {
    search: z.string().optional().describe("Filtre texte sur le nom ou la catégorie."),
    limit: z.number().int().optional().describe("Nombre maximum de produits retournés (défaut 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const term = search?.trim().toLowerCase();
    const items = (mockProducts as Array<Record<string, unknown>>)
      .filter((p) =>
        !term
          ? true
          : `${p.name ?? ""} ${p.category ?? ""}`.toLowerCase().includes(term),
      )
      .slice(0, Math.max(1, Math.min(limit ?? 20, 100)));

    return {
      content: [{ type: "text", text: JSON.stringify(items) }],
      structuredContent: { count: items.length, products: items },
    };
  },
});
