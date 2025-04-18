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

type ChecklistItem = { label: string; checked: boolean };

export default function Journal() {
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { label: "", checked: false },
  ]);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteType, setNoteType] = useState<"text" | "checklist">("text");
  const [notes, setNotes] = useState<NoteI[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLDivElement>(null);
  const [isReminder, setIsReminder] = useState<boolean>(false);
  const [reminderDate, setReminderDate] = useState<string>("");

  useEffect(() => {
    if (isNoteExpanded && textareaRef.current && noteType === "text") {
      textareaRef.current.focus();
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
    setChecklistItems([{ label: "", checked: false }]);
    setNoteTitle("");
    setIsNoteExpanded(false);
    setEditingNoteId(null);
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
        return { label, checked };
      });

      // Always ensure there's at least one item (possibly empty)
      if (
        items.length === 0 ||
        (items.length > 0 && items[items.length - 1].label !== "")
      ) {
        items.push({ label: "", checked: false });
      }

      setChecklistItems(items);
    }
    setIsNoteExpanded(true);
  }

  function saveNote() {
    if (!noteContent.trim() && !noteTitle.trim()) {
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
      updatedNotes = notes.map((note) =>
        note.id === editingNoteId
          ? {
              ...note,
              content,
              ...(reminderDate ? { reminder: reminderDate } : {}),
              title: noteTitle,
              type: noteType,
            }
          : note
      );
    } else {
      updatedNotes = [
        ...notes,
        {
          content,
          title: noteTitle,
          id: uuidv4(),
          type: noteType,
        },
      ];
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
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    const isLastItem = index === checklistItems.length - 1;

    if (event.key === "Enter") {
      event.preventDefault();

      if (checklistItems[index].label.trim() !== "") {
        if (isLastItem) {
          setChecklistItems([...checklistItems, { label: "", checked: false }]);
        } else {
          setChecklistItems([
            ...checklistItems.slice(0, index + 1),
            { label: "", checked: false },
            ...checklistItems.slice(index + 1),
          ]);
        }
      }
    } else if (
      event.key === "Backspace" &&
      checklistItems[index].label === ""
    ) {
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
        .map((line) => ({ label: line, checked: false }));

      // Add empty item at the end
      lines.push({ label: "", checked: false });

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
      setChecklistItems([{ label: "", checked: false }]);
      setNoteType("text");
    }
  }

  // function
  function addReminder(value: Date) {
    setReminderDate(formatDate(value));
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
                  <div
                    ref={textareaRef}
                    className={styles.textarea}
                    contentEditable="true"
                    onInput={(e) => {
                      const target = e.target as HTMLDivElement;
                      setNoteContent(target.innerText);
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {noteContent}
                  </div>
                ) : (
                  <div className={styles.checklistEditor}>
                    {checklistItems.map((item, i) => (
                      <div
                        key={i}
                        className={`${styles.checklistItem} ${
                          isEmptyItem(item) ? styles.addItem : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleChecklistItem(i)}
                        />
                        <div
                          contentEditable="true"
                          data-ph="+ Add item"
                          onInput={(e) => {
                            const target = e.target as HTMLDivElement;
                            updateChecklistItemLabel(i, target.innerText);
                          }}
                          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                            handleChecklistKeyDown(i, e)
                          }
                          className={`${
                            isEmptyItem(item) ? styles.addItemInput : ""
                          } ${styles.editable}`}
                          style={getChecklistItemStyle(item.checked)}
                          suppressContentEditableWarning={true}
                        >
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.buttons}>
                <div className={styles.remindMeDiv}>
                  <button className={styles.button}>
                    {reminderDate ? (
                      <BiBellMinus onClick={() => setReminderDate("")} />
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
                        !noteContent && !noteTitle && styles.empty
                      }`}
                      onClick={saveNote}
                    >
                      <LuCheck />
                      {!noteContent && !noteTitle && (
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
