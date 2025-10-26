'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface TextBlockProps {
  content: {
    html: string;
  };
  onChange: (content: any) => void;
  isSelected: boolean;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'align',
  'link',
];

export default function TextBlock({ content, onChange, isSelected }: TextBlockProps) {
  const [value, setValue] = useState(content.html || '');
  const quillRef = useRef<any>(null);

  useEffect(() => {
    setValue(content.html || '');
  }, [content.html]);

  const handleChange = (html: string) => {
    setValue(html);
    onChange({ html });
  };

  useEffect(() => {
    if (isSelected && quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.focus();
    }
  }, [isSelected]);

  return (
    <div className="text-block w-full">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Start typing..."
        className="bg-white"
      />
    </div>
  );
}
