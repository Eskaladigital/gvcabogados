import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';

interface Props {
  currentPostId: string;
  categoryId: string | null;
  categoryName: string;
}

async function getRelatedPosts(currentPostId: string, categoryId: string | null) {
  let query = supabaseAdmin
    .from('blog_posts')
    .select(`
      id,
      slug_en,
      title_en,
      excerpt_en,
      published_at,
      reading_time_minutes,
      blog_categories(name_en, color)
    `)
    .eq('status', 'published')
    .neq('id', currentPostId)
    .not('slug_en', 'is', null)
    .not('title_en', 'is', null)
    .order('published_at', { ascending: false })
    .limit(3);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data } = await query;
  return data || [];
}

export default async function RelatedPostsEn({ currentPostId, categoryId, categoryName }: Props) {
  const relatedPosts = await getRelatedPosts(currentPostId, categoryId);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 pt-12 mt-12">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
          Related articles
        </h2>
        {categoryName && (
          <p className="text-sm text-neutral-500">
            More articles on <span className="font-semibold">{categoryName}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post: any) => (
          <Link
            key={post.id}
            href={`/en/blog/${post.slug_en}`}
            className="group border border-neutral-200 bg-white hover:shadow-lg hover:border-brand-brown transition-all duration-300 flex flex-col"
          >
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-3">
                {post.blog_categories && (
                  <span
                    className="text-[0.5rem] font-bold text-white px-2 py-0.5 uppercase tracking-wider"
                    style={{ backgroundColor: post.blog_categories.color || '#714c20' }}
                  >
                    {post.blog_categories.name_en}
                  </span>
                )}
              </div>

              <h3 className="font-display text-base font-bold text-brand-dark leading-tight mb-2 group-hover:text-brand-brown transition-colors line-clamp-2">
                {post.title_en}
              </h3>

              {post.excerpt_en && (
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                  {post.excerpt_en}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
                <div className="text-[0.65rem] text-neutral-400 flex items-center gap-1">
                  {post.reading_time_minutes && (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.reading_time_minutes} min
                    </>
                  )}
                </div>
                <span className="text-[0.7rem] font-semibold text-brand-brown flex items-center gap-1">
                  Read
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
