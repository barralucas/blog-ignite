import { Document } from '@prismicio/client/types/documents';

export default function linkResolver(doc: Document): string {
  if (doc.type === 'posts1') {
    return `/post/${doc.uid}`;
  }
  return '/';
}