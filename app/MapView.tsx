'use client';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Minus, Plus, Maximize2 } from "lucide-react";

interface MapViewProps {
  addresses: Array<{
    id: string;
    title: string;
    addressLine1: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  selectedAddress?: string;
  onNavigate?: (addressId: string) => void;
}

export default function MapView({
  addresses,
  selectedAddress,
  onNavigate,
}: MapViewProps) {
  const defaultCenter = { lat: 19.0760, lng: 72.8777 };

  // Allow user override zoom
  const [userZoom, setUserZoom] = useState<number | null>(null);

  const selectedAddressObj = addresses.find(
    (a) => a.id === selectedAddress
  );

  // Derived center
  const center =
    selectedAddressObj?.coordinates || defaultCenter;

  // Derived zoom
  const zoom =
    userZoom ??
    (selectedAddressObj?.coordinates ? 15 : 12);

  const handleZoomIn = () =>
    setUserZoom((prev) =>
      Math.min((prev ?? zoom) + 1, 18)
    );

  const handleZoomOut = () =>
    setUserZoom((prev) =>
      Math.max((prev ?? zoom) - 1, 8)
    );

  const handleResetZoom = () => setUserZoom(12);

  return (
    <Card className="border-2 border-gray-200 overflow-hidden">
      <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100">
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-lg"
            onClick={handleZoomIn}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-lg"
            onClick={handleZoomOut}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-lg"
            onClick={handleResetZoom}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Simulated Map Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-md">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#337ab7] rounded-full">
              <MapPin className="h-8 w-8 text-white" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Interactive Map View
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                Zoom Level: {zoom}x • Center:{" "}
                {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Showing {addresses.length} location
                {addresses.length !== 1 ? "s" : ""} on map
              </p>
            </div>
          </div>
        </div>

        {/* Location Markers */}
        {addresses.map((address, index) => {
          const isSelected =
            address.id === selectedAddress;

          const offsetX = (index % 3) * 150 - 150;
          const offsetY =
            Math.floor(index / 3) * 120 - 120;

          return (
            <div
              key={address.id}
              className="absolute"
              style={{
                left: `calc(50% + ${offsetX}px)`,
                top: `calc(50% + ${offsetY}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`relative group cursor-pointer transition-all ${
                  isSelected
                    ? "scale-125"
                    : "scale-100 hover:scale-110"
                }`}
                onClick={() => onNavigate?.(address.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    isSelected
                      ? "bg-[#337ab7] ring-4 ring-blue-200"
                      : "bg-red-500 ring-2 ring-red-200"
                  }`}
                >
                  <MapPin className="h-6 w-6 text-white" />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
                    <p className="font-semibold">
                      {address.title}
                    </p>
                    <p className="text-xs text-gray-300">
                      {address.city}, {address.state}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>

                {/* Pulse animation */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-[#337ab7] opacity-30 animate-ping"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}