import React, { useState, useCallback } from 'react';
import { HiPhotograph } from 'react-icons/hi';
import ImagePicker from './ImagePicker';

const ImagePickerButton = ({ 
  onImageSelect, 
  selectedImage = null,
  buttonText = "Choose Image",
  buttonVariant = "default", // default, outline, ghost
  buttonSize = "md", // sm, md, lg
  className = "",
  disabled = false
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleImageSelect = useCallback((file) => {
    console.log('ImagePickerButton: Image selected:', file);
    if (onImageSelect) {
      onImageSelect(file);
    }
    console.log('ImagePickerButton: Closing picker after selection');
    setShowPicker(false);
  }, [onImageSelect]);

  const handleCancel = useCallback(() => {
    console.log('ImagePickerButton: Cancel clicked, closing picker');
    setShowPicker(false);
  }, []);

  const handleOpenPicker = useCallback(() => {
    if (!disabled) {
      console.log('ImagePickerButton: Opening picker');
      setShowPicker(true);
    }
  }, [disabled]);

  const getButtonClasses = () => {
    const baseClasses = "flex items-center gap-2 transition-all duration-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    const variantClasses = {
      default: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md",
      outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500",
      ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    };

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95";

    return `${baseClasses} ${sizeClasses[buttonSize]} ${variantClasses[buttonVariant]} ${disabledClasses} ${className}`;
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenPicker}
        className={getButtonClasses()}
        disabled={disabled}
        title={disabled ? "Image picker disabled" : "Open image picker"}
      >
        <HiPhotograph className="w-4 h-4" />
        {buttonText}
      </button>

      {showPicker && (
        <ImagePicker
          onSelect={handleImageSelect}
          onCancel={handleCancel}
          selectedImage={selectedImage}
          title="Select Image"
          description="Choose an image from your media library"
        />
      )}
    </>
  );
};

export default ImagePickerButton; 