import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Minus,
  Upload,
  Loader2,
  Maximize2,
  Minimize2,
  Type,
  Pilcrow,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AdvancedRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onFocusModeChange?: (enabled: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  shortcut?: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ToolbarButton = ({ icon, tooltip, shortcut, isActive, onClick, disabled }: ToolbarButtonProps) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          pressed={isActive}
          onPressedChange={onClick}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          {icon}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-2">
        <span>{tooltip}</span>
        {shortcut && (
          <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">{shortcut}</kbd>
        )}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const AdvancedRichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing your story...",
  onFocusModeChange,
}: AdvancedRichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-primary pl-4 italic text-muted-foreground",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline hover:text-primary/80" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg my-6 shadow-md" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg max-w-none focus:outline-none",
          "prose-headings:font-bold prose-headings:text-foreground",
          "prose-p:text-foreground/90 prose-p:leading-relaxed",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-blockquote:border-primary prose-blockquote:text-muted-foreground",
          "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
          "prose-pre:bg-muted prose-pre:text-foreground",
          "prose-img:rounded-lg prose-img:shadow-lg",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-li:text-foreground/90"
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => {
      const newValue = !prev;
      onFocusModeChange?.(newValue);
      return newValue;
    });
  }, [onFocusModeChange]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setLinkDialogOpen(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(
    (url: string) => {
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
        setImageUrl("");
        setImageDialogOpen(false);
      }
    },
    [editor]
  );

  const handleImageUpload = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG, PNG, WebP, or GIF images.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      addImage(publicUrl);
      toast({ title: "Image uploaded", description: "Image added to your content." });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  if (!editor) return null;

  return (
    <div
      className={cn(
        "border border-border rounded-xl overflow-hidden bg-background transition-all duration-300",
        focusMode && "fixed inset-4 z-50 flex flex-col shadow-2xl"
      )}
    >
      {/* Toolbar */}
      <div className="border-b border-border bg-muted/30 sticky top-0 z-10">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex flex-wrap items-center gap-0.5">
            {/* Undo/Redo */}
            <ToolbarButton
              icon={<Undo className="h-4 w-4" />}
              tooltip="Undo"
              shortcut="⌘Z"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              icon={<Redo className="h-4 w-4" />}
              tooltip="Redo"
              shortcut="⌘⇧Z"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                  <Type className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">
                    {editor.isActive("heading", { level: 1 })
                      ? "Heading 1"
                      : editor.isActive("heading", { level: 2 })
                      ? "Heading 2"
                      : editor.isActive("heading", { level: 3 })
                      ? "Heading 3"
                      : "Paragraph"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().setParagraph().run()}
                >
                  <Pilcrow className="h-4 w-4 mr-2" />
                  Paragraph
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text Formatting */}
            <ToolbarButton
              icon={<Bold className="h-4 w-4" />}
              tooltip="Bold"
              shortcut="⌘B"
              isActive={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              icon={<Italic className="h-4 w-4" />}
              tooltip="Italic"
              shortcut="⌘I"
              isActive={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              icon={<UnderlineIcon className="h-4 w-4" />}
              tooltip="Underline"
              shortcut="⌘U"
              isActive={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ToolbarButton
              icon={<Strikethrough className="h-4 w-4" />}
              tooltip="Strikethrough"
              isActive={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
            <ToolbarButton
              icon={<Code className="h-4 w-4" />}
              tooltip="Inline Code"
              isActive={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
            />

            <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

            {/* Alignment - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-0.5">
              <ToolbarButton
                icon={<AlignLeft className="h-4 w-4" />}
                tooltip="Align Left"
                isActive={editor.isActive({ textAlign: "left" })}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
              />
              <ToolbarButton
                icon={<AlignCenter className="h-4 w-4" />}
                tooltip="Align Center"
                isActive={editor.isActive({ textAlign: "center" })}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
              />
              <ToolbarButton
                icon={<AlignRight className="h-4 w-4" />}
                tooltip="Align Right"
                isActive={editor.isActive({ textAlign: "right" })}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
              />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists & Blocks */}
            <ToolbarButton
              icon={<List className="h-4 w-4" />}
              tooltip="Bullet List"
              isActive={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              icon={<ListOrdered className="h-4 w-4" />}
              tooltip="Numbered List"
              isActive={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              icon={<Quote className="h-4 w-4" />}
              tooltip="Quote"
              isActive={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
              icon={<Minus className="h-4 w-4" />}
              tooltip="Horizontal Rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Link Dialog */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <ToolbarButton
                    icon={<LinkIcon className="h-4 w-4" />}
                    tooltip="Add Link"
                    shortcut="⌘K"
                    isActive={editor.isActive("link")}
                    onClick={() => setLinkDialogOpen(true)}
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Insert Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      onKeyDown={(e) => e.key === "Enter" && addLink()}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={addLink} className="flex-1">
                      Add Link
                    </Button>
                    {editor.isActive("link") && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          editor.chain().focus().unsetLink().run();
                          setLinkDialogOpen(false);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <ToolbarButton
                    icon={
                      isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )
                    }
                    tooltip="Add Image"
                    disabled={isUploading}
                    onClick={() => setImageDialogOpen(true)}
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="upload" className="flex-1">
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex-1">
                      URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="py-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ALLOWED_TYPES.join(",")}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 rounded-full bg-primary/10">
                            <Upload className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Click to upload image</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              JPG, PNG, WebP, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="url" className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => e.key === "Enter" && addImage(imageUrl)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => addImage(imageUrl)}
                      disabled={!imageUrl}
                      className="w-full"
                    >
                      Add Image
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Focus Mode Toggle */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFocusMode}
                  className="h-8 w-8 p-0 ml-2"
                >
                  {focusMode ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {focusMode ? "Exit Focus Mode" : "Focus Mode"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Editor Content */}
      <div className={cn("overflow-auto", focusMode ? "flex-1" : "")}>
        <EditorContent
          editor={editor}
          className={cn(
            "p-6 min-h-[400px] focus:outline-none",
            "[&_.ProseMirror]:min-h-[380px] [&_.ProseMirror]:outline-none",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
            "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
            focusMode && "max-w-3xl mx-auto py-12"
          )}
        />
      </div>

      {/* Focus Mode Overlay Close Button */}
      {focusMode && (
        <button
          onClick={toggleFocusMode}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default AdvancedRichTextEditor;
