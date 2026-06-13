import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CheckoutProgress } from "./checkout/CheckoutProgress";
import { CartStep } from "./checkout/CartStep";
import { DeliveryStep, type DeliveryFormData } from "./checkout/DeliveryStep";
import { ConfirmationStep } from "./checkout/ConfirmationStep";
import { celebrate } from "@/components/ui/celebration";
import type { CheckoutStep } from "@/types/order";

interface CartSheetProps {
  trigger?: React.ReactNode;
}

export function CartSheet({ trigger }: CartSheetProps) {
  const { totalItems, subCarts } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    subCarts.length > 0 ? subCarts[0].businessId : null
  );
  const [deliveryData, setDeliveryData] = useState<DeliveryFormData | null>(null);

  const defaultTrigger = (
    <Button variant="outline" size="icon" className="relative">
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  );

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
  };

  const handleStepClick = (step: CheckoutStep) => {
    setCurrentStep(step);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setCurrentStep('cart');
      setDeliveryData(null);
    }, 300);
  };

  const handleConfirmOrder = () => {
    // Move to confirmation step (order created, waiting for business)
    setCurrentStep('confirmation');
    celebrate({
      title: "Commande envoyée !",
      message: "Le vendeur va recevoir votre demande dans un instant.",
      variant: "party",
      emoji: "🎉",
    });
  };

  const handleFinalClose = () => {
    // TODO: Create order in database
    handleClose();
    navigate(`/commandes`);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'cart': return 'Mon Panier';
      case 'delivery': return 'Commande';
      case 'summary': return 'Récapitulatif';
      case 'confirmation': return 'Confirmation de la commande';
      default: return 'Mon Panier';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'cart':
        return (
          <CartStep
            selectedBusinessId={selectedBusinessId}
            onSelectBusiness={handleSelectBusiness}
            onContinue={() => setCurrentStep('delivery')}
          />
        );
      case 'delivery':
        return (
          <DeliveryStep
            onBack={() => setCurrentStep('cart')}
            onContinue={(data) => {
              setDeliveryData(data);
              setCurrentStep('summary');
            }}
            initialData={deliveryData || undefined}
          />
        );
      case 'summary':
        return (
          <ConfirmationStep
            selectedBusinessId={selectedBusinessId}
            deliveryData={deliveryData}
            onConfirm={handleConfirmOrder}
            onBack={() => setCurrentStep('delivery')}
          />
        );
      case 'confirmation':
        return (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4 space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Commande envoyée !</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Votre commande a été envoyée au vendeur. Vous serez notifié dès qu'il aura accepté ou refusé votre commande.
              </p>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              ⏳ En attente de confirmation du vendeur
            </Badge>
            <Button className="w-full max-w-xs h-12" onClick={handleFinalClose}>
              Suivre ma commande
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-full p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-2 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <ShoppingCart className="w-6 h-6 text-primary" />
              {getStepTitle()}
              {currentStep === 'cart' && totalItems > 0 && (
                <Badge variant="secondary">{totalItems} articles</Badge>
              )}
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress indicator */}
          {currentStep !== 'confirmation' && (
            <div className="px-4">
              <CheckoutProgress 
                currentStep={currentStep} 
                onStepClick={handleStepClick}
              />
            </div>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
          {renderStep()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
