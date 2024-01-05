"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Note =
  | {
      id: number;
      title: string;
      content: string;
      active: boolean;
    }
  | undefined;

const initialState: Note[] = [
  {
    id: 1,
    title: "Note 1",
    content: "This is Note 1",
    active: true,
  },
  { id: 2, title: "Note 2", content: "This is Note 2", active: false },
  { id: 3, title: "Note 3", content: "This is Note 3", active: false },
  { id: 4, title: "Note 4", content: "This is Note 4", active: false },
];

export default function Notes() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeNote, setActiveNote] = useState<Note>(initialState[0]);
  const [notes, _] = useState<Note[]>(initialState);

  const ref = useRef<HTMLElement>();

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [showModal]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full p-4">
        <Dialog open={showModal}>
          <div className="pr-4 w-[20%]">
            <h1 className="text-center text-2xl font-bold mb-4">Notes</h1>
            {notes.map((note) => {
              return (
                <div
                  key={note?.id}
                  className={`${
                    activeNote?.id === note?.id
                      ? "bg-blue-500 text-white"
                      : "bg-white-500"
                  } flex flex-col w-[100%] border-white-500 border-2 rounded p-4 hover cursor-pointer hover:bg-blue-500 hover:text-white ease-in-out duration-300`}
                  onClick={() => {
                    const activeNote = notes.find((n) => n?.active);

                    if (note?.id !== activeNote?.id && editing)
                      setShowModal(true);

                    setActiveNote(note);
                  }}
                >
                  {note?.title}
                </div>
              );
            })}
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Do you want to discard or save your changes?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                className="mr-4"
                variant="destructive"
                onClick={() => setShowModal(false)}
              >
                Discard Changes
              </Button>
              <Button className="mr-4" onClick={() => setShowModal(false)}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-[80%]">
          <textarea
            name="content"
            className="w-[100%] h-[500px] text-black bg-white border-2 border-white-500 rounded-lg p-4"
            onChange={(e) => {
              const activeNote = notes.find((note) => note?.active);
            }}
            value={activeNote?.content}
          />
        </div>
      </div>
    </div>
  );
}
