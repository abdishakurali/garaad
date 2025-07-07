import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

const VideoBlock: React.FC<{
  content: {
    source: string;
    type: string;
    title?: string;
    controls?: boolean;
    description?: string;
  };
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
      <Card className="w-full shadow-lg rounded-2xl border border-gray-100 bg-white">
        <CardContent className="p-6">
          {content.title && (
            <h3 className="text-lg font-bold text-center mb-4">
              {content.title}
            </h3>
          )}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
            <video
              src={content.source}
              controls={content.controls}
              className="w-full h-full object-cover"
            >
              Browser-kaagu ma taageerayo video-ga.
            </video>
          </div>
          {content.description && (
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {content.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {isLastBlock ? "Dhamee" : "Sii wado"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideoBlock;
