'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useRouter } from 'next/navigation';
import { BookOpen, Search, Eye, ThumbsUp, Plus, Tag, ChevronRight } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F7F7' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
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
    <div className="min-h-screen flex flex-col" style={{ background: '#F9F7F7' }}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#112D4E' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#3F72AF' }} />
                Knowledge Base
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#3F72AF' }}>
                {fetching ? 'Loading…' : `${filteredArticles.length} articles available`}
              </p>
            </div>
            {isAdmin && (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                  color: '#F9F7F7',
                  boxShadow: '0 4px 16px rgba(63,114,175,0.3)',
                }}
              >
                <Plus className="w-4 h-4" />
                New Article
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#3F72AF' }} />
            <input
              type="text"
              placeholder="Search knowledge articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm placeholder:text-[#3F72AF]/50 focus:outline-none focus:ring-2"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                borderColor: '#DBE2EF',
                color: '#112D4E',
                boxShadow: '0 2px 8px rgba(63,114,175,0.08)',
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={
                  category === cat
                    ? {
                        background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                        color: '#F9F7F7',
                        boxShadow: '0 2px 8px rgba(63,114,175,0.25)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid #DBE2EF',
                        color: '#3F72AF',
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedArticle ? (
            /* Article Detail View */
            <div
              className="rounded-2xl border p-6"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderColor: '#DBE2EF',
                boxShadow: '0 8px 32px rgba(63,114,175,0.10)',
              }}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs mb-4 flex items-center gap-1 transition-colors"
                style={{ color: '#3F72AF' }}
              >
                ← Back to articles
              </button>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#DBE2EF', color: '#3F72AF' }}
                  >
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl font-extrabold mt-2" style={{ color: '#112D4E' }}>{selectedArticle.title}</h2>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0 ml-4" style={{ color: '#3F72AF' }}>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{selectedArticle.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{selectedArticle.helpful}</span>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-5">
                {selectedArticle.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: '#DBE2EF', color: '#3F72AF' }}
                  >
                    <Tag className="w-2.5 h-2.5" />{tag.trim()}
                  </span>
                ))}
              </div>
              <div className="prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap" style={{ color: '#112D4E' }}>
                {selectedArticle.content}
              </div>
              <div className="mt-6 pt-4 border-t flex items-center gap-3" style={{ borderColor: '#DBE2EF' }}>
                <span className="text-xs" style={{ color: '#3F72AF' }}>Was this article helpful?</span>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:-translate-y-0.5"
                  style={{ background: '#DBE2EF', borderColor: '#3F72AF', color: '#112D4E' }}
                >
                  👍 Yes
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.7)', borderColor: '#DBE2EF', color: '#3F72AF' }}
                >
                  👎 No
                </button>
              </div>
            </div>
          ) : (
            fetching ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3F72AF', borderTopColor: 'transparent' }} />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#DBE2EF' }} />
                <p className="font-medium" style={{ color: '#3F72AF' }}>No articles found</p>
                <p className="text-xs mt-1" style={{ color: '#3F72AF' }}>Try different keywords or categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="text-left rounded-2xl border p-5 transition-all duration-300 group hover:-translate-y-1"
                    style={{
                      background: 'rgba(255,255,255,0.75)',
                      backdropFilter: 'blur(12px)',
                      borderColor: '#DBE2EF',
                      boxShadow: '0 4px 16px rgba(63,114,175,0.08), 0 1.5px 0 #DBE2EF',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#DBE2EF', color: '#3F72AF' }}
                      >
                        {article.category}
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" style={{ color: '#3F72AF' }} />
                    </div>
                    <h3 className="text-sm font-bold mb-2 group-hover:text-[#3F72AF] transition-colors" style={{ color: '#112D4E' }}>
                      {article.title}
                    </h3>
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#3F72AF' }}>
                      {article.content.slice(0, 150)}…
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-[10px]" style={{ color: '#3F72AF' }}>
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
