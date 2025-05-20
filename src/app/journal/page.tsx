"use client";
import { useState, useEffect, useRef } from "react";
import { formatDate } from "../helpers/functions";
import styles from "./Journal.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { NoteI } from "../helpers/interfaces";
import { saveData } from "../helpers/functions";
import { v4 as uuidv4 } from "uuid";
import {
  MdOutlineDeleteForever,
  MdOutlineEdit,
  MdOutlineCheckBox,
} from "react-icons/md";
import { LuNotepadText, LuCheck, LuAlarmClockCheck } from "react-icons/lu";
import { BiBellPlus, BiBellMinus } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Calendar from "react-calendar";
import {
  DndContext,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

type ChecklistItem = { id: string; label: string; checked: boolean };

// Create a sortable checklist item component
function SortableChecklistItem({
  item,
  index,
  toggleChecklistItem,
  updateChecklistItemLabel,
  handleChecklistKeyDown,
  getChecklistItemStyle,
  isEmptyItem,
  inputRef,
}: {
  item: ChecklistItem;
  index: number;
  toggleChecklistItem: (index: number) => void;
  updateChecklistItemLabel: (index: number, label: string) => void;
  handleChecklistKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  getChecklistItemStyle: (isChecked: boolean) => React.CSSProperties;
  isEmptyItem: (item: ChecklistItem) => boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.checklistItem} ${
        isEmptyItem(item) ? styles.addItem : ""
      }`}
    >
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <MdDragIndicator size={16} />
      </div>
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => toggleChecklistItem(index)}
      />
      <textarea
        value={item.label}
        placeholder={isEmptyItem(item) ? "+ Add item" : ""}
        onChange={(e) => updateChecklistItemLabel(index, e.target.value)}
        onKeyDown={(e) => handleChecklistKeyDown(index, e)}
        ref={index === 0 ? inputRef : null}
        className={isEmptyItem(item) ? styles.addItemInput : ""}
        style={getChecklistItemStyle(item.checked)}
      />
    </div>
  );
}

export default function Journal() {
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: uuidv4(), label: "", checked: false },
  ]);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteType, setNoteType] = useState<"text" | "checklist">("text");
  const [notes, setNotes] = useState<NoteI[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const checklistInputRef = useRef<HTMLTextAreaElement>(null);
  const [isReminder, setIsReminder] = useState<boolean>(false);
  const [reminderDate, setReminderDate] = useState<string>("");

  // Set up drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance required before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isNoteExpanded && textareaRef.current && noteType === "text") {
      textareaRef.current.focus();
    } else if (
      isNoteExpanded &&
      checklistInputRef.current &&
      noteType === "checklist"
    ) {
      checklistInputRef.current.focus();
    }
  }, [isNoteExpanded, noteType]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setNotes(Array.isArray(data.notes) ? data.notes : []);
    }
    fetchData();
  }, []);

  function cancelNote() {
    setNoteContent("");
    setChecklistItems([{ id: uuidv4(), label: "", checked: false }]);
    setNoteTitle("");
    setIsNoteExpanded(false);
    setEditingNoteId(null);
    setNoteType("text");
    setReminderDate("");
    setIsReminder(false);
  }

  const distributeNotes = (notes: NoteI[], columnCount: number) => {
    const columns = Array.from({ length: columnCount }, () => [] as NoteI[]);
    notes.forEach((note, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(note);
    });
    return columns;
  };

  const noteColumns = distributeNotes(notes, 4);

  function deleteNote(id: string) {
    const isCertain = confirm("Are you sure you want to delete this note?");
    if (!isCertain) return;
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveData({ notes: updatedNotes });
  }

  function editNote(id: string) {
    setEditingNoteId(id);
    const editedNote = notes.find((note) => note.id === id);
    if (!editedNote) return;

    setNoteTitle(editedNote.title || "");
    setNoteType(editedNote.type);
    if (editedNote.type === "text") {
      setNoteContent(editedNote.content || "");
    } else {
      // checklist
      const noteContent = editedNote.content || "";
      const items = noteContent.split("\n").map((line) => {
        const checked = line.startsWith("- [x]");
        const label = line.replace(/^- \[[ x]\] /, "");
        return { id: uuidv4(), label, checked };
      });

      // Always ensure there's at least one item (possibly empty)
      if (
        items.length === 0 ||
        (items.length > 0 && items[items.length - 1].label !== "")
      ) {
        items.push({ id: uuidv4(), label: "", checked: false });
      }

      setChecklistItems(items);
    }
    setIsNoteExpanded(true);

    // Set reminder if exists
    if (editedNote.reminder) {
      setReminderDate(editedNote.reminder);
    } else {
      setReminderDate("");
    }
  }

  function saveNote() {
    const hasContent =
      noteType === "text"
        ? noteContent.trim() !== ""
        : checklistItems.some((item) => item.label.trim() !== "");

    if (!hasContent && !noteTitle.trim()) {
      cancelNote();
      return;
    }

    // Filter out the last empty item before saving
    const itemsToSave = checklistItems.filter(
      (item) => item.label.trim() !== ""
    );

    const content =
      noteType === "text"
        ? noteContent
        : itemsToSave
            .map((item) => `- [${item.checked ? "x" : " "}] ${item.label}`)
            .join("\n");

    let updatedNotes;
    if (editingNoteId) {
      updatedNotes = notes.map((note) => {
        if (note.id === editingNoteId) {
          // Create a new note object
          const updatedNote = {
            ...note,
            content,
            title: noteTitle,
            type: noteType,
          };

          // Only add the reminder property if reminderDate is not empty
          if (reminderDate) {
            updatedNote.reminder = reminderDate;
          } else {
            // Explicitly delete the reminder property if it exists
            delete updatedNote.reminder;
          }

          return updatedNote;
        }
        return note;
      });
    } else {
      // For new notes, only add reminder if it exists
      const newNote: NoteI = {
        content,
        title: noteTitle,
        id: uuidv4(),
        type: noteType,
      };

      if (reminderDate) {
        newNote.reminder = reminderDate;
      }

      updatedNotes = [...notes, newNote];
    }

    setNotes(updatedNotes);
    saveData({ notes: updatedNotes });
    cancelNote();
  }

  function toggleChecklistItem(index: number) {
    const newItems = [...checklistItems];
    newItems[index].checked = !newItems[index].checked;
    setChecklistItems(newItems);
  }

  function handleChecklistKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    const isLastItem = index === checklistItems.length - 1;

    if (event.key === "Enter") {
      event.preventDefault();

      if (checklistItems[index].label.trim() !== "") {
        if (isLastItem) {
          setChecklistItems([
            ...checklistItems,
            { id: uuidv4(), label: "", checked: false },
          ]);
        } else {
          setChecklistItems([
            ...checklistItems.slice(0, index + 1),
            { id: uuidv4(), label: "", checked: false },
            ...checklistItems.slice(index + 1),
          ]);
        }
      }
    } else if (
      event.key === "Backspace" &&
      checklistItems[index].label === ""
    ) {
      if (isLastItem) {
        if (index > 0) {
          return;
        }
        return;
      }

      const updatedItems = checklistItems.filter((_, i) => i !== index);
      setChecklistItems(updatedItems);
    }
  }

  function updateChecklistItemLabel(index: number, newLabel: string) {
    const newItems = [...checklistItems];
    newItems[index].label = newLabel;
    setChecklistItems(newItems);
  }

  // CSS styles for checklist items
  const getChecklistItemStyle = (isChecked: boolean) => {
    return {
      textDecoration: isChecked ? "line-through" : "none",
      opacity: isChecked ? 0.6 : 1,
      color: isChecked ? "rgba(255, 255, 255, 0.6)" : "white",
    };
  };

  // Checklist or plain text
  function checklistToggle() {
    if (noteType === "text") {
      // Initialize checklist with one empty item
      const lines = noteContent
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => ({ id: uuidv4(), label: line, checked: false }));

      // Add empty item at the end
      lines.push({ id: uuidv4(), label: "", checked: false });

      setChecklistItems(lines);
      setNoteContent("");
      setNoteType("checklist");
    } else {
      // Convert to plain text, filter out the last empty item
      const nonEmptyItems = checklistItems.filter(
        (item) => item.label.trim() !== ""
      );

      const plainText = nonEmptyItems.map((item) => item.label).join("\n");

      setNoteContent(plainText);
      setChecklistItems([{ id: uuidv4(), label: "", checked: false }]);
      setNoteType("text");
    }
  }

  // Handle drag end event for checklist items
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = checklistItems.findIndex((item) => item.id === active.id);
    const newIndex = checklistItems.findIndex((item) => item.id === over.id);

    setChecklistItems(arrayMove(checklistItems, oldIndex, newIndex));
  }

  // function to add reminder
  function addReminder(value: Date) {
    setReminderDate(formatDate(value));
    setIsReminder(false);
  }

  // function to remove reminder
  function removeReminder() {
    setReminderDate("");
    setIsReminder(false);
  }

  const isEmptyItem = (item: ChecklistItem) =>
    item.label === "" && !item.checked;

  return (
    <div className={styles.journal}>
      <div className={styles.journalContainer}>
        <div className={styles.notesContainer}>
          {noteColumns.map((column, columnIndex) => (
            <div key={columnIndex} className={styles.column}>
              {column.map((note) => (
                <div
                  key={note.id}
                  data-id={note.id}
                  className={`${styles.note} ${
                    note.id === editingNoteId ? styles.hiddenNote : ""
                  }`}
                  onClick={() => {
                    editNote(note.id);
                  }}
                >
                  {note.title && (
                    <p className={styles.noteTitle}>{note.title}</p>
                  )}
                  {note.type === "checklist" ? (
                    <ul className={styles.checklist}>
                      {(note.content || "").split("\n").map((line, i) => {
                        const isChecked = line.startsWith("- [x]");
                        const label = line.replace(/^- \[[ x]\] /, "");
                        return (
                          <li key={i}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                            />
                            <span style={getChecklistItemStyle(isChecked)}>
                              {label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className={styles.noteP}>{note.content || ""}</p>
                  )}
                  <div className={styles.noteButtons}>
                    {note.reminder && (
                      <div className={styles.buttonsLeft}>
                        <LuAlarmClockCheck />
                        <p className={styles.reminderP}>{note.reminder}</p>
                      </div>
                    )}
                    <div className={styles.buttonsRight}>
                      <MdOutlineEdit className={styles.edit} />
                      <MdOutlineDeleteForever
                        className={styles.delete}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          className={`${styles.addNewNote} ${
            isNoteExpanded && styles.expanded
          }`}
        >
          {isNoteExpanded ? (
            <>
              <div className={styles.addNewNoteInner}>
                <input
                  placeholder="Title"
                  type="text"
                  className={styles.noteTitle}
                  name="noteTitle"
                  onChange={(e) => setNoteTitle(e.target.value)}
                  value={noteTitle ?? ""}
                />

                {noteType === "text" ? (
                  <textarea
                    ref={textareaRef}
                    className={styles.textarea}
                    name="note"
                    onChange={(e) => setNoteContent(e.target.value)}
                    value={noteContent ?? ""}
                    placeholder="Write your note..."
                  />
                ) : (
                  <div className={styles.checklistEditor}>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={checklistItems.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {checklistItems.map((item, i) => (
                          <SortableChecklistItem
                            key={item.id}
                            item={item}
                            index={i}
                            toggleChecklistItem={toggleChecklistItem}
                            updateChecklistItemLabel={updateChecklistItemLabel}
                            handleChecklistKeyDown={handleChecklistKeyDown}
                            getChecklistItemStyle={getChecklistItemStyle}
                            isEmptyItem={isEmptyItem}
                            inputRef={checklistInputRef}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>

              <div className={styles.buttons}>
                <div className={styles.remindMeDiv}>
                  <button className={styles.button}>
                    {reminderDate ? (
                      <BiBellMinus onClick={removeReminder} />
                    ) : (
                      <BiBellPlus onClick={() => setIsReminder(!isReminder)} />
                    )}
                  </button>
                  {reminderDate && (
                    <p className={styles.reminderDateP}>{reminderDate}</p>
                  )}
                  {isReminder && (
                    <div className={styles.remindMeOpen}>
                      <p className={styles.remindMeP}>Remind me on:</p>
                      <Calendar onClickDay={(value) => addReminder(value)} />
                    </div>
                  )}
                </div>
                <div className={styles.buttonsRight}>
                  <button className={styles.button} onClick={checklistToggle}>
                    {noteType === "checklist" ? (
                      <LuNotepadText />
                    ) : (
                      <MdOutlineCheckBox />
                    )}
                  </button>
                  <button className={styles.button} onClick={cancelNote}>
                    <RxCross2 />
                  </button>
                  <div className={styles.saveNoteDiv}>
                    <button
                      className={`${styles.button} ${
                        !noteContent &&
                        !noteTitle &&
                        checklistItems.every((item) => !item.label.trim()) &&
                        styles.empty
                      }`}
                      onClick={saveNote}
                    >
                      <LuCheck />
                      {!noteContent &&
                        !noteTitle &&
                        checklistItems.every((item) => !item.label.trim()) && (
                          <p className={styles.saveNoteLabel}>Note is empty!</p>
                        )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p
              className={styles.addNewNoteP}
              onClick={() => setIsNoteExpanded(true)}
            >
              <AiOutlinePlus />
              Add New Note
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
