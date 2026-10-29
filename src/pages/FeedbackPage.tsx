import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  CheckCircle2, 
  Send,
  MessageSquareHeart,
  Quote,
  Sparkles,
  Award,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { LiquidGlassCard, LiquidGlassBadge } from '../components/LiquidGlass';

export const FeedbackPage: React.FC = () => {
  const { requests, submitFeedback, showToast } = useApp();

  const completedRequests = requests.filter(r => r.status === 'completed');
  const pendingFeedbackRequests = completedRequests.filter(r => !r.feedback);

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    pendingFeedbackRequests[0]?.id || completedRequests[0]?.id || ''
  );
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const targetRequest = requests.find(r => r.id === selectedRequestId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId) {
      showToast('Please select a completed request to review.', 'warning');
      return;
    }
    if (!comment.trim()) {
      showToast('Please write a brief comment describing your experience.', 'warning');
      return;
    }

    submitFeedback(selectedRequestId, rating, comment);
    setComment('');
    showToast('Thank you! Your feedback has been published.', 'success');
  };

  const feedbackHistory = requests.filter(r => r.feedback);
  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Liquid Glass Header Hero */}
      <LiquidGlassCard variant="emerald" className="p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 border border-[#b7e4c7] text-[#1b4332] text-xs font-bold shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#52b788]" />
            <span>Community Trust & Service Quality</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1b4332] tracking-tight">
            Senior Citizen Feedback & Service Reviews
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Your honest reviews ensure that our partner NGOs and community volunteers maintain the highest standards of dignity, warmth, and promptness.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#1b4332]">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-[#b7e4c7]">
              <ShieldCheck className="w-4 h-4 text-[#40916c]" />
              <span>100% Verified Senior Experiences</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-[#b7e4c7]">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Direct Volunteer Recognition</span>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Submit Feedback Form Card with Liquid Glass */}
      <LiquidGlassCard variant="default" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/10">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shadow-2xs">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1b4332]">
              Submit Service Feedback
            </h2>
            <p className="text-xs text-stone-500">
              Reviews can be submitted only once an assistance request is marked completed.
            </p>
          </div>
        </div>

        {pendingFeedbackRequests.length === 0 && (!targetRequest || targetRequest.feedback) ? (
          <div className="p-8 rounded-2xl bg-[#f0fbf5]/80 border border-[#d8f3dc] text-center space-y-3 backdrop-blur-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-[#40916c]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#1b4332]">No Pending Feedback Required</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              All your completed assistance requests have already been reviewed. When a new service concludes, you will be able to share feedback here.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Select Completed Request */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Select Completed Service Request *
              </label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="input-glass w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
              >
                {completedRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.id} — {req.title} ({req.assignedVolunteerName || 'Volunteer'})
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating Widget with interactive hover */}
            <div className="p-4 rounded-2xl bg-white/70 border border-[#b7e4c7] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Overall Rating *
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-3xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <span className={star <= activeRating ? 'text-amber-500 drop-shadow-xs' : 'text-stone-300'}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs font-bold text-[#1b4332] ml-2 px-3 py-1 rounded-full bg-[#f0fbf5] border border-[#d8f3dc]">
                  {activeRating === 5 && '★★★★★ Outstanding Support'}
                  {activeRating === 4 && '★★★★ Very Helpful & Polite'}
                  {activeRating === 3 && '★★★ Good Assistance'}
                  {activeRating === 2 && '★★ Needs Improvement'}
                  {activeRating === 1 && '★ Unsatisfactory'}
                </span>
              </div>
            </div>

            {/* Feedback Comment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Describe Your Experience *
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share how the volunteer assisted you, timeliness, politeness, comfort..."
                className="input-glass w-full px-4 py-3 rounded-2xl text-xs sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-glass-primary px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#74c69d]" />
              <span>Submit Honest Review</span>
            </button>
          </form>
        )}
      </LiquidGlassCard>

      {/* Community Feedback & Testimonials History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-[#40916c]" />
            <h2 className="text-lg font-bold text-[#1b4332]">
              Past Service Records & Testimonials ({feedbackHistory.length})
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Verified Senior Reviews
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbackHistory.map((req) => (
            <LiquidGlassCard
              key={req.id}
              variant="subtle"
              className="p-5 flex flex-col justify-between space-y-4 hover:border-[#52b788] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    {'★'.repeat(req.feedback?.rating || 5)}
                    {'☆'.repeat(5 - (req.feedback?.rating || 5))}
                  </div>
                  <LiquidGlassBadge variant="subtle" className="text-[10px] font-mono">
                    {req.id}
                  </LiquidGlassBadge>
                </div>

                <div className="relative pl-6">
                  <Quote className="w-4 h-4 text-[#52b788]/40 absolute left-0 top-0 -scale-x-100" />
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    "{req.feedback?.comment}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#1b4332]">{req.seniorName}</div>
                  <div className="text-[11px] text-stone-500 capitalize">{req.city} · {req.type} Assistance</div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-stone-500">Volunteer: </span>
                  <strong className="text-[#1b4332] block font-semibold">
                    {req.assignedVolunteerName || 'Community Volunteer'}
                  </strong>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};

