import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./supabase";

export default defineTool({
  name: "send_order_message",
  title: "Envoyer un message sur une commande",
  description:
    "Envoie un message dans la messagerie d'une commande au nom de l'utilisateur connecté.",
  inputSchema: {
    order_id: z.string().min(1).describe("Identifiant de la commande."),
    content: z.string().trim().min(1).describe("Contenu du message à envoyer."),
    sender_role: z
      .enum(["seller", "buyer"])
      .optional()
      .describe("Rôle de l'expéditeur (défaut: seller)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ order_id, content, sender_role }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("order_messages")
      .insert({
        order_id,
        content,
        sender_role: sender_role ?? "seller",
        sender_name: ctx.getUserEmail() ?? "Utilisateur",
      })
      .select();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data?.[0]) }],
      structuredContent: { message: data?.[0] ?? null },
    };
  },
});
