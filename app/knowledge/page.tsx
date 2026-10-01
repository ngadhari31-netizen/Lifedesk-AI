'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, Eye, ThumbsUp, Plus, Tag, ChevronRight, Sparkles } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string;
  status: string;
  views: number;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ['All', 'Account', 'Payments', 'Orders', 'Delivery', 'Refunds', 'Subscriptions', 'Security', 'Technical Support', 'Billing', 'General'];

export default function KnowledgePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/knowledge')
        .then((r) => r.json())
        .then((d) => setArticles(d.articles || []))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredArticles = articles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    return matchSearch && matchCat && a.status === 'PUBLISHED';
  });

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-sky-500" />
                Knowledge Base
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {fetching ? 'Loading...' : `${filteredArticles.length} articles available`}
              </p>
            </div>
            {isAdmin && (
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Article
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search knowledge articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  category === cat
                    ? 'bg-sky-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedArticle ? (
            /* Article Detail View */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1"
              >
                ← Back to articles
              </button>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full">{selectedArticle.category}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">{selectedArticle.title}</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0 ml-4">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{selectedArticle.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{selectedArticle.helpful}</span>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-5">
                {selectedArticle.tags.split(',').map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                    <Tag className="w-2.5 h-2.5" />{tag.trim()}
                  </span>
                ))}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-500">Was this article helpful?</span>
                <button className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors">
                  👍 Yes
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors">
                  👎 No
                </button>
              </div>
            </div>
          ) : (
            /* Articles Grid */
            fetching ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No articles found</p>
                <p className="text-xs text-slate-400 mt-1">Try different keywords or categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {article.content.slice(0, 150)}...
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views} views</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{article.helpful} helpful</span>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
