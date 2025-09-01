import React, { useState } from 'react';
import { Problem, Chapter } from '../types';

interface AddProblemFormProps {
  topicId: number;
  chapters: Chapter[];
  onAddProblem: (problem: Problem) => void;
  onAddChapter: (chapter: Chapter) => void;
  onAddSubsection: (chapterId: string, subsection: { id: string; title: string; problems: Problem[] }) => void;
}

const AddProblemForm: React.FC<AddProblemFormProps> = ({
  topicId,
  chapters,
  onAddProblem,
  onAddChapter,
  onAddSubsection
}) => {
  const [formMode, setFormMode] = useState<'problem' | 'chapter' | 'subsection'>('problem');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [selectedSubsectionId, setSelectedSubsectionId] = useState('');
  
  // Problem form fields
  const [problemNumber, setProblemNumber] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemUrl, setProblemUrl] = useState('');
  const [problemDifficulty, setProblemDifficulty] = useState('');
  
  // Chapter form fields
  const [chapterTitle, setChapterTitle] = useState('');
  
  // Subsection form fields
  const [subsectionTitle, setSubsectionTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'problem') {
      if (problemNumber.trim() && problemTitle.trim() && selectedChapterId && selectedSubsectionId) {
        const newProblem: Problem = {
          id: `${topicId}-${problemNumber}-${Date.now()}`,
          topicId,
          chapterId: selectedChapterId,
          subsectionId: selectedSubsectionId,
          number: problemNumber.trim(),
          title: problemTitle.trim(),
          url: problemUrl.trim().replace('leetcode.cn', 'leetcode.com') || 
                `https://leetcode.com/problems/${problemTitle.toLowerCase().replace(/\s+/g, '-')}/`,
          difficulty: problemDifficulty ? parseInt(problemDifficulty) : undefined,
          completed: false
        };
        onAddProblem(newProblem);
        
        // Reset form
        setProblemNumber('');
        setProblemTitle('');
        setProblemUrl('');
        setProblemDifficulty('');
      }
    } else if (formMode === 'chapter') {
      if (chapterTitle.trim()) {
        const newChapter: Chapter = {
          id: `chapter-${Date.now()}`,
          title: chapterTitle.trim(),
          subsections: []
        };
        onAddChapter(newChapter);
        setChapterTitle('');
      }
    } else if (formMode === 'subsection') {
      if (subsectionTitle.trim() && selectedChapterId) {
        const newSubsection = {
          id: `subsection-${Date.now()}`,
          title: subsectionTitle.trim(),
          problems: []
        };
        onAddSubsection(selectedChapterId, newSubsection);
        setSubsectionTitle('');
      }
    }
  };

  const selectedChapter = chapters.find(c => c.id === selectedChapterId);

  return (
    <div className="add-problem-form-container">
      <div className="form-mode-selector">
        <button
          type="button"
          className={`mode-btn ${formMode === 'problem' ? 'active' : ''}`}
          onClick={() => setFormMode('problem')}
        >
          新增題目
        </button>
        <button
          type="button"
          className={`mode-btn ${formMode === 'chapter' ? 'active' : ''}`}
          onClick={() => setFormMode('chapter')}
        >
          新增章節
        </button>
        <button
          type="button"
          className={`mode-btn ${formMode === 'subsection' ? 'active' : ''}`}
          onClick={() => setFormMode('subsection')}
        >
          新增小節
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        {formMode === 'problem' && (
          <>
            <div className="form-row">
              <select
                value={selectedChapterId}
                onChange={(e) => {
                  setSelectedChapterId(e.target.value);
                  setSelectedSubsectionId('');
                }}
                className="select-field"
                required
              >
                <option value="">選擇章節</option>
                {chapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>

              {selectedChapter && (
                <select
                  value={selectedSubsectionId}
                  onChange={(e) => setSelectedSubsectionId(e.target.value)}
                  className="select-field"
                  required
                >
                  <option value="">選擇小節</option>
                  {selectedChapter.subsections.map(subsection => (
                    <option key={subsection.id} value={subsection.id}>
                      {subsection.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-row">
              <input
                type="text"
                placeholder="題號 (如: 1456)"
                value={problemNumber}
                onChange={(e) => setProblemNumber(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="題目名稱"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="form-row">
              <input
                type="url"
                placeholder="題目連結 (選填，會自動生成)"
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                className="input-field"
              />
              <input
                type="number"
                placeholder="難度分 (選填)"
                value={problemDifficulty}
                onChange={(e) => setProblemDifficulty(e.target.value)}
                className="input-field"
              />
            </div>
          </>
        )}

        {formMode === 'chapter' && (
          <input
            type="text"
            placeholder="章節標題 (如: 一、定長滑動視窗)"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="input-field"
            required
          />
        )}

        {formMode === 'subsection' && (
          <>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="select-field"
              required
            >
              <option value="">選擇章節</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="小節標題 (如: §1.1 基礎)"
              value={subsectionTitle}
              onChange={(e) => setSubsectionTitle(e.target.value)}
              className="input-field"
              required
            />
          </>
        )}

        <button type="submit" className="submit-btn">
          {formMode === 'problem' ? '新增題目' : 
           formMode === 'chapter' ? '新增章節' : '新增小節'}
        </button>
      </form>
    </div>
  );
};

export default AddProblemForm;