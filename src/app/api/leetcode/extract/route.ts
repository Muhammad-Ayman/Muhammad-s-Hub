import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate LeetCode URL
    if (!url.includes('leetcode.com/problems/')) {
      return NextResponse.json(
        { error: 'Please provide a valid LeetCode problem URL' },
        { status: 400 },
      );
    }

    try {
      // Fetch the LeetCode page
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch problem page');
      }

      const html = await response.text();

      // Extract problem title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      let title = 'Unknown Problem';
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1]
          .replace(' - LeetCode', '')
          .replace(/^\d+\.\s*/, '') // Remove number prefix
          .trim();
      }

      // Extract difficulty from the page
      let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';
      if (html.includes('Easy') || html.includes('easy')) {
        difficulty = 'EASY';
      } else if (html.includes('Hard') || html.includes('hard')) {
        difficulty = 'HARD';
      } else if (html.includes('Medium') || html.includes('medium')) {
        difficulty = 'MEDIUM';
      }

      // Extract tags/topics (common LeetCode topics)
      const commonTags = [
        'Array',
        'String',
        'Hash Table',
        'Dynamic Programming',
        'Math',
        'Two Pointers',
        'Binary Search',
        'Tree',
        'Depth-First Search',
        'Breadth-First Search',
        'Greedy',
        'Backtracking',
        'Stack',
        'Queue',
        'Linked List',
        'Binary Tree',
        'Graph',
        'Heap',
        'Sorting',
        'Recursion',
        'Sliding Window',
        'Union Find',
        'Trie',
        'Bit Manipulation',
        'Design',
      ];

      const extractedTags: string[] = [];
      const lowerHtml = html.toLowerCase();

      commonTags.forEach((tag) => {
        if (lowerHtml.includes(tag.toLowerCase()) && extractedTags.length < 5) {
          extractedTags.push(tag);
        }
      });

      // If no tags found, try to extract from URL or use generic ones
      if (extractedTags.length === 0) {
        const urlParts = url.toLowerCase();
        if (urlParts.includes('array')) extractedTags.push('Array');
        if (urlParts.includes('string')) extractedTags.push('String');
        if (urlParts.includes('tree')) extractedTags.push('Tree');
        if (urlParts.includes('graph')) extractedTags.push('Graph');

        // Default tag if nothing found
        if (extractedTags.length === 0) {
          extractedTags.push('Algorithm');
        }
      }

      return NextResponse.json({
        title,
        difficulty,
        tags: extractedTags,
        url,
      });
    } catch (error) {
      console.error('Error extracting problem info:', error);

      // Fallback: extract basic info from URL
      const urlParts = url.split('/');
      const problemSlug =
        urlParts[urlParts.indexOf('problems') + 1] || 'unknown-problem';
      const fallbackTitle = problemSlug
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return NextResponse.json({
        title: fallbackTitle,
        difficulty: 'MEDIUM' as const,
        tags: ['Algorithm'],
        url,
        fallback: true,
      });
    }
  } catch (error) {
    console.error('Extract LeetCode API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
