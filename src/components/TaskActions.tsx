'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskActions({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, projectId }),
    });

    if (res.ok) {
      setIsOpen(false);
      setTitle('');
      setDescription('');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>+ Add Task</button>
      
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Task</h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={3} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
