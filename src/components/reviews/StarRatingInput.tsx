import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function StarRatingInput({ value, onChange, size = "md", readOnly = false }: StarRatingInputProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={cn(
            "transition-transform",
            !readOnly && "hover:scale-110 cursor-pointer",
            readOnly && "cursor-default"
          )}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange(star)}
        >
          <Star
            className={cn(
              sizeMap[size],
              "transition-colors",
              (hover || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}
