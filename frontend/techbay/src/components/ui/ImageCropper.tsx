import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "./dialog";
import { Button } from "./button";
import getCroppedImg from "../../utils/getCroppedImage";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
}

const ImageCropper = ({ imageSrc, onCropComplete, onClose }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(true);

  const onCropCompleteCallback = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedArea);
    if(croppedImage){
        onCropComplete(croppedImage);
    }
    handleCloseModel()
  };

  const handleCloseModel = () => {
    setDialogOpen(false)
    onClose()
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={open => {
          setDialogOpen(open);
          if (!open) {
            onClose();
          }
        }}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop your Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-[400px] w-[400px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteCallback}
            />
          </div>
          <DialogFooter>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant={"secondary"} type="button" onClick={handleCloseModel}>Cancel</Button>
              <Button type="button" onClick={handleCropSave}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCropper;
