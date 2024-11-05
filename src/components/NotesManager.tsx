import React, { useState, useEffect } from 'react';
import { StickyNote, Search, Plus, Trash2, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

const NotesManager = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const saveNote = () => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note => 
      note.id === activeNote.id 
        ? { ...note, title: editTitle, content: editContent, lastModified: Date.now() }
        : note
    );
    setNotes(updatedNotes);
    setActiveNote({ ...activeNote, title: editTitle, content: editContent });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setEditTitle('');
      setEditContent('');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-indigo-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-indigo-400" />
          <h2 className="text-indigo-400 text-lg font-semibold">Notes</h2>
        </div>
        <button
          onClick={createNote}
          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-4 h-[500px]">
        <div className="w-1/3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded-lg pl-10 pr-4 py-2 text-indigo-100 placeholder-indigo-400/50"
            />
          </div>

          <div className="space-y-2 overflow-y-auto h-[calc(100%-3rem)]">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => {
                  setActiveNote(note);
                  setEditTitle(note.title);
                  setEditContent(note.content);
                }}
                className={`p-3 rounded-lg cursor-pointer ${
                  activeNote?.id === note.id
                    ? 'bg-indigo-500/20 border border-indigo-500'
                    : 'bg-indigo-900/20 border border-indigo-500/30 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-indigo-100 font-medium truncate">
                    {note.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-indigo-300 text-sm truncate mt-1">
                  {note.content}
                </p>
                <p className="text-indigo-400/50 text-xs mt-2">
                  {new Date(note.lastModified).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 space-y-4">
          {activeNote ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-indigo-900/20 border border-indigo-500/30 rounded-lg px-4 py-2 text-indigo-100"
                placeholder="Note title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-[calc(100%-6rem)] bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 text-indigo-100 resize-none"
                placeholder="Start typing your note..."
              />
              <button
                onClick={saveNote}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-indigo-400/50">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesManager;