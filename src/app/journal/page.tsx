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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const checklistInputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  // Update refs when checklist items change
  useEffect(() => {
    checklistInputRefs.current = checklistInputRefs.current.slice(
      0,
      checklistItems.length
    );
  }, [checklistItems]);

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
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    const isLastItem = index === checklistItems.length - 1;

    if (event.key === "Enter") {
      // Check if the current item is not empty before adding a new one
      if (checklistItems[index].label.trim() !== "") {
        // If it's the last item, transform it into a normal item and add a new empty one
        if (isLastItem) {
          setChecklistItems([...checklistItems, { label: "", checked: false }]);
        } else {
          // Insert a new item after the current one
          setChecklistItems([
            ...checklistItems.slice(0, index + 1),
            { label: "", checked: false },
            ...checklistItems.slice(index + 1),
          ]);
        }

        // Focus on the new item
        setTimeout(() => {
          if (checklistInputRefs.current[index + 1]) {
            checklistInputRefs.current[index + 1]?.focus();
          }
        }, 0);
      }
    } else if (
      event.key === "Backspace" &&
      checklistItems[index].label === ""
    ) {
      // If it's the last item and empty, don't delete it
      if (isLastItem) {
        // If there's a previous item, move focus to it
        if (index > 0) {
          setTimeout(() => {
            const prevInput = checklistInputRefs.current[index - 1];
            if (prevInput) {
              prevInput.focus();
              // Position cursor at the end of the text
              const length = prevInput.value.length;
              prevInput.setSelectionRange(length, length);
            }
          }, 0);
        }
        return;
      }

      // Delete checklist item when Backspace is pressed and the input is empty
      const updatedItems = checklistItems.filter((_, i) => i !== index);
      setChecklistItems(updatedItems);

      // Focus on the previous input if it exists
      if (index > 0) {
        setTimeout(() => {
          const prevInput = checklistInputRefs.current[index - 1];
          if (prevInput) {
            prevInput.focus();
            // Position cursor at the end of the text
            const length = prevInput.value.length;
            prevInput.setSelectionRange(length, length);
          }
        }, 0);
      }
    }
  }

  function updateChecklistItemLabel(index: number, newLabel: string) {
    const newItems = [...checklistItems];
    newItems[index].label = newLabel;
    setChecklistItems(newItems);
  }

  function handleAddChecklistItem() {
    // Focus on the last item's input field
    setTimeout(() => {
      const lastIndex = checklistItems.length - 1;
      if (checklistInputRefs.current[lastIndex]) {
        checklistInputRefs.current[lastIndex]?.focus();
      }
    }, 0);
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
                        <input
                          type="text"
                          value={item.label}
                          placeholder={isEmptyItem(item) ? "+ Add item" : ""}
                          onChange={(e) =>
                            updateChecklistItemLabel(i, e.target.value)
                          }
                          onKeyDown={(e) => handleChecklistKeyDown(i, e)}
                          onClick={() => {
                            if (isEmptyItem(item)) {
                              handleAddChecklistItem();
                            }
                          }}
                          ref={(el) => {
                            checklistInputRefs.current[i] = el;
                          }}
                          className={
                            isEmptyItem(item) ? styles.addItemInput : ""
                          }
                          style={getChecklistItemStyle(item.checked)}
                        />
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
