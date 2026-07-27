import { auth, defineMcp } from "@lovable.dev/mcp-js";
import whoamiTool from "./tools/whoami";
import listProductsTool from "./tools/list-products";
import listOrdersTool from "./tools/list-orders";
import listOrderMessagesTool from "./tools/list-order-messages";
import sendOrderMessageTool from "./tools/send-order-message";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "fastrelays-mcp",
  title: "FastRelays MCP",
  version: "0.1.0",
  instructions:
    "Outils FastRelays : consulter les produits et commandes de la boutique, lire et envoyer des messages sur une commande. Utilisez `whoami` pour vérifier l'utilisateur connecté.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    whoamiTool,
    listProductsTool,
    listOrdersTool,
    listOrderMessagesTool,
    sendOrderMessageTool,
  ],
});
