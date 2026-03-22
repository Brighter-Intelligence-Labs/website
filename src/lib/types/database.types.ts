export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			articles: {
				Row: {
					id: string;
					title: string;
					slug: string;
					content: string | null;
					excerpt: string | null;
					category: string;
					status: string;
					author: string;
					tags: string[];
					read_time: string | null;
					featured: boolean;
					research_notes: string | null;
					draft_content: string | null;
					published_at: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					slug: string;
					content?: string | null;
					excerpt?: string | null;
					category: string;
					status?: string;
					author?: string;
					tags?: string[];
					read_time?: string | null;
					featured?: boolean;
					research_notes?: string | null;
					draft_content?: string | null;
					published_at?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					slug?: string;
					content?: string | null;
					excerpt?: string | null;
					category?: string;
					status?: string;
					author?: string;
					tags?: string[];
					read_time?: string | null;
					featured?: boolean;
					research_notes?: string | null;
					draft_content?: string | null;
					published_at?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			article_embeddings: {
				Row: {
					id: string;
					article_id: string;
					chunk_index: number;
					chunk_text: string;
					embedding: number[];
					created_at: string;
				};
				Insert: {
					id?: string;
					article_id: string;
					chunk_index: number;
					chunk_text: string;
					embedding: number[];
					created_at?: string;
				};
				Update: {
					id?: string;
					article_id?: string;
					chunk_index?: number;
					chunk_text?: string;
					embedding?: number[];
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'article_embeddings_article_id_fkey';
						columns: ['article_id'];
						referencedRelation: 'articles';
						referencedColumns: ['id'];
					}
				];
			};
			conversations: {
				Row: {
					id: string;
					session_token: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					session_token: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					session_token?: string;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			messages: {
				Row: {
					id: string;
					conversation_id: string;
					role: string;
					content: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					conversation_id: string;
					role: string;
					content: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					conversation_id?: string;
					role?: string;
					content?: string;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'messages_conversation_id_fkey';
						columns: ['conversation_id'];
						referencedRelation: 'conversations';
						referencedColumns: ['id'];
					}
				];
			};
			subscribers: {
				Row: {
					id: string;
					email: string;
					name: string | null;
					status: string;
					subscribed_at: string;
					unsubscribed_at: string | null;
				};
				Insert: {
					id?: string;
					email: string;
					name?: string | null;
					status?: string;
					subscribed_at?: string;
					unsubscribed_at?: string | null;
				};
				Update: {
					id?: string;
					email?: string;
					name?: string | null;
					status?: string;
					subscribed_at?: string;
					unsubscribed_at?: string | null;
				};
				Relationships: [];
			};
			email_campaigns: {
				Row: {
					id: string;
					subject: string;
					body_html: string;
					body_text: string;
					article_id: string | null;
					status: string;
					sent_at: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					subject: string;
					body_html: string;
					body_text: string;
					article_id?: string | null;
					status?: string;
					sent_at?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					subject?: string;
					body_html?: string;
					body_text?: string;
					article_id?: string | null;
					status?: string;
					sent_at?: string | null;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'email_campaigns_article_id_fkey';
						columns: ['article_id'];
						referencedRelation: 'articles';
						referencedColumns: ['id'];
					}
				];
			};
			email_events: {
				Row: {
					id: string;
					campaign_id: string;
					subscriber_id: string;
					event_type: string;
					event_data: Json;
					created_at: string;
				};
				Insert: {
					id?: string;
					campaign_id: string;
					subscriber_id: string;
					event_type: string;
					event_data?: Json;
					created_at?: string;
				};
				Update: {
					id?: string;
					campaign_id?: string;
					subscriber_id?: string;
					event_type?: string;
					event_data?: Json;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'email_events_campaign_id_fkey';
						columns: ['campaign_id'];
						referencedRelation: 'email_campaigns';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'email_events_subscriber_id_fkey';
						columns: ['subscriber_id'];
						referencedRelation: 'subscribers';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			search_articles: {
				Args: {
					query_embedding: number[];
					match_threshold?: number;
					match_count?: number;
				};
				Returns: {
					article_id: string;
					chunk_index: number;
					chunk_text: string;
					similarity: number;
					title: string;
					slug: string;
					category: string;
					excerpt: string | null;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
