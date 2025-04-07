"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./Journal.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import AddOrCancelBtn from "../components/goalsForToday/addGoal/addOrCancelBtn/AddOrCancelBtn";
import { NoteI } from "../helpers/interfaces";
import { saveData } from "../helpers/functions";

export default function Journal() {
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [notes, setNotes] = useState<NoteI[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isNoteExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isNoteExpanded]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const data = await res.json();
      setNotes(Array.isArray(data.notes) ? data.notes : []);
    }
    fetchData();
  }, []);

  function addNote() {
    const updatedNotes = [...notes, { content: noteContent, title: noteTitle }];
    setNotes(updatedNotes);
    saveData({ notes: updatedNotes });
    setNoteContent("");
    setNoteTitle("");
    setIsNoteExpanded(false);
  }

  function cancelNote() {
    setNoteContent("");
    setNoteTitle("");
    setIsNoteExpanded(false);
  }

  // Helper function to distribute notes into columns more efficiently
  const distributeNotes = (notes: NoteI[], columnCount: number) => {
    const columns = Array.from({ length: columnCount }, () => [] as NoteI[]);

    notes.forEach((note, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(note);
    });

    return columns;
  };

  const noteColumns = distributeNotes(notes, 4);

  return (
    <div>
      <div className={styles.journal}>
        <div className={styles.journalContainer}>
          <div className={styles.notesContainer}>
            {noteColumns.map((column, columnIndex) => (
              <div key={columnIndex} className={styles.column}>
                {column.map((note, noteIndex) => (
                  <div key={noteIndex} className={styles.note}>
                    <p className={styles.noteTitle}>{note.title}</p>
                    <p className={styles.noteP}>{note.content}</p>
                    <button>Delete</button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            className={`${styles.addNewNote} ${
              isNoteExpanded && styles.expanded
            } `}
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
                  <textarea
                    ref={textareaRef}
                    className={styles.textarea}
                    name="note"
                    onChange={(e) => setNoteContent(e.target.value)}
                    value={noteContent ?? ""}
                  ></textarea>
                </div>
                <div className={styles.buttons}>
                  <AddOrCancelBtn onAdd={addNote} onCancel={cancelNote} />
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
    </div>
  );
}
