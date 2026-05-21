'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { getSkills, createSkill, deleteSkill } from '@/services/skills.service';
import type { Skill } from '@/types';

const CATEGORIES = ['Languages & Frameworks', 'Tools & Infrastructure', 'Focus Areas'];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ category: CATEGORIES[0], name: '' });
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const data = await getSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    setAdding(true);
    try {
      await createSkill({ ...newSkill, sort_order: skills.length });
      setNewSkill(prev => ({ ...prev, name: '' }));
      load();
      toast.success('Skill added!');
    } catch {
      toast.error('Failed to add');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Skills</h1>

      {/* Add form */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Add Skill</h2>
        <div className="flex gap-3">
          <select
            value={newSkill.category}
            onChange={e => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent bg-white"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            value={newSkill.name}
            onChange={e => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. React.js"
            className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-accent"
          />
          <button onClick={handleAdd} disabled={adding || !newSkill.name.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 disabled:opacity-60 transition-colors">
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>

      {/* Skills by category */}
      {!loading && CATEGORIES.map(cat => (
        <div key={cat} className="bg-white border border-neutral-200 rounded-lg p-5 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">{cat}</h2>
          {grouped[cat]?.length === 0 ? (
            <p className="text-sm text-neutral-400">No skills in this category.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {grouped[cat].map(skill => (
                <div key={skill.id} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-md text-sm text-neutral-700">
                  {skill.name}
                  <button onClick={() => handleDelete(skill.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors ml-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}