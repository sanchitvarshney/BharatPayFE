import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, ButtonGroup, Tooltip, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";

const TipTapEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextAlign],
    content: "<p>Start typing...</p>",
  });

  if (!editor) {
    return null;
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          padding: "0.5rem",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ButtonGroup variant="text">
          <Tooltip title="Bold">
            <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive("bold") ? "primary" : "default"}>
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive("italic") ? "primary" : "default"}>
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton onClick={() => editor.chain().focus().toggleUnderline?.()?.run()} color={editor.isActive("underline") ? "primary" : "default"}>
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup variant="text" sx={{ marginLeft: 2 }}>
          <Tooltip title="Align Left">
            <IconButton onClick={() => editor.chain().focus().setTextAlign("left").run()} color={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}>
              <FormatAlignLeftIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Center">
            <IconButton onClick={() => editor.chain().focus().setTextAlign("center").run()} color={editor.isActive({ textAlign: "center" }) ? "primary" : "default"}>
              <FormatAlignCenterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Right">
            <IconButton onClick={() => editor.chain().focus().setTextAlign("right").run()} color={editor.isActive({ textAlign: "right" }) ? "primary" : "default"}>
              <FormatAlignRightIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup variant="text" sx={{ marginLeft: 2 }}>
          <Tooltip title="Bulleted List">
            <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive("bulletList") ? "primary" : "default"}>
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered List">
            <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive("orderedList") ? "primary" : "default"}>
              <FormatListNumberedIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "1rem",
          minHeight: "200px",
          marginTop: "1rem",
          backgroundColor: "#fff",
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default TipTapEditor;
