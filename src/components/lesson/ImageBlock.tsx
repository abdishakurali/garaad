import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

const ImageBlock: React.FC<{
  content: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption: string;
  };
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  if (!content?.url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Image not available</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={onContinue}>
              {isLastBlock ? "Dhamee" : "Sii wado"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="relative aspect-video w-full">
            <Image
              src={content.url || "/placeholder.svg"}
              alt={content.alt || "image"}
              width={content.width || 800}
              height={content.height || 600}
              className="object-cover rounded-lg"
              unoptimized={process.env.NODE_ENV !== "production"} // Optional: disable optimization in development
            />
          </div>
          {content.caption && (
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {content.caption}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onContinue}>
            {isLastBlock ? "Dhamee" : "Sii wado"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageBlock;
