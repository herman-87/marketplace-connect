import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./supabase";

export default defineTool({
  name: "list_order_messages",
  title: "Lire la messagerie d'une commande",
  description:
    "Retourne les messages échangés sur une commande, triés du plus ancien au plus récent.",
  inputSchema: {
    order_id: z.string().min(1).describe("Identifiant de la commande."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("order_messages")
      .select("*")
      .eq("order_id", order_id)
      .order("created_at", { ascending: true });

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { count: data?.length ?? 0, messages: data ?? [] },
    };
  },
});
