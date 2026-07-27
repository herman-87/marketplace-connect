import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { mockOrders } from "@/data/businessMockData";

export default defineTool({
  name: "list_orders",
  title: "Lister les commandes",
  description:
    "Liste les commandes de la boutique avec le client, le montant et le statut. Un filtre de statut optionnel est disponible.",
  inputSchema: {
    status: z.string().optional().describe("Filtre exact sur le statut de la commande."),
    limit: z.number().int().optional().describe("Nombre maximum de commandes retournées (défaut 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const wanted = status?.trim().toLowerCase();
    const items = (mockOrders as Array<Record<string, unknown>>)
      .filter((o) => (!wanted ? true : String(o.status ?? "").toLowerCase() === wanted))
      .slice(0, Math.max(1, Math.min(limit ?? 20, 100)));

    return {
      content: [{ type: "text", text: JSON.stringify(items) }],
      structuredContent: { count: items.length, orders: items },
    };
  },
});
