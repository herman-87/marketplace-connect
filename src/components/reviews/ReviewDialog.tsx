import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingInput } from "./StarRatingInput";
import { MessageSquare } from "lucide-react";
import { useReviews } from "@/contexts/ReviewsContext";

interface ReviewDialogProps {
  type: "product" | "shop";
  targetId: string;
  targetName: string;
  trigger?: React.ReactNode;
}

export function ReviewDialog({ type, targetId, targetName, trigger }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { addReview } = useReviews();

  const handleSubmit = () => {
    if (rating === 0) return;
    addReview(type, targetId, rating, comment);
    setRating(0);
    setComment("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            Donner un avis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-8">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold">Votre avis</DialogTitle>
          <p className="text-sm text-muted-foreground">{targetName}</p>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Note</p>
            <StarRatingInput value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Très insatisfait"}
                {rating === 2 && "Insatisfait"}
                {rating === 3 && "Correct"}
                {rating === 4 && "Satisfait"}
                {rating === 5 && "Excellent !"}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Commentaire (optionnel)</p>
            <Textarea
              placeholder="Partagez votre expérience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <Button
            className="w-full h-11 font-semibold"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Publier mon avis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
