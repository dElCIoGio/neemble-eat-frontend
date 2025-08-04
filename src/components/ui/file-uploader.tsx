
import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UploadIcon, XIcon } from "lucide-react"

interface FileUploaderProps {
    value: File | null | undefined
    onChange: (file: File | null) => void
    accept: string
    maxSize: number
    disabled?: boolean
}

export function FileUploader({onChange, accept, maxSize, disabled = false }: FileUploaderProps) {
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Create preview when file is selected
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            return
        }

        // Validate file type
        if (!accept.includes(file.type)) {
            setError(`O arquivo deve ser ${accept.replace("image/", "").toUpperCase()}`)
            return
        }

        // Validate file size
        if (file.size > maxSize) {
            setError(`O arquivo deve ter menos de ${Math.round(maxSize / 1024 / 1024)}MB`)
            return
        }

        // Clear any previous errors
        setError(null)

        // Create preview URL
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // Pass file to parent component
        onChange(file)

        // Clean up preview URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl)
    }

    // Handle file removal
    const handleRemove = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        setPreview(null)
        onChange(null)
    }

    // Handle click on the upload area
    const handleUploadClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <div className="space-y-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={accept}
                className="hidden"
                disabled={disabled}
            />

            {!preview ? (
                <div
                    onClick={handleUploadClick}
                    className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <UploadIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para enviar ou arraste e solte</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {accept.replace("image/", "").toUpperCase()} (máx {Math.round(maxSize / 1024 / 1024)}MB)
                    </p>
                </div>
            ) : (
                <div className="relative">
                    <div className="rounded-md overflow-hidden border bg-background">
                        <div className="relative aspect-video w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {preview && (
                                    <img
                                        src={preview || "/placeholder.svg"}
                                        alt="Pré-visualização"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleRemove}
                        disabled={disabled}
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}
