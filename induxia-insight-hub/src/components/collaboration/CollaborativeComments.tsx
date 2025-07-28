import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Heart, 
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Paperclip
} from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  type: 'comment' | 'status_update' | 'assignment' | 'attachment';
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
  attachments?: string[];
}

interface CollaborativeCommentsProps {
  workOrderId: string;
  className?: string;
}

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: { name: 'John Doe', role: 'Maintenance Technician' },
    content: 'Started working on the conveyor belt issue. Found that the bearing is completely worn out and needs immediate replacement.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'comment',
    likes: 3,
    replies: [
      {
        id: 'c1r1',
        author: { name: 'Sarah Connor', role: 'Maintenance Manager' },
        content: 'Thanks for the update! I\'ve ordered the replacement bearing. Should arrive by tomorrow morning.',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        type: 'comment',
        likes: 1,
        replies: []
      }
    ]
  },
  {
    id: 'c2',
    author: { name: 'System', role: 'Automated' },
    content: 'Work order status changed from "Open" to "In Progress"',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'status_update',
    likes: 0,
    replies: []
  },
  {
    id: 'c3',
    author: { name: 'Mike Wilson', role: 'Production Supervisor' },
    content: 'This is affecting Line 2 production. Priority should be increased. We\'re losing approximately 50 units per hour.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    type: 'comment',
    likes: 5,
    replies: []
  }
];

export function CollaborativeComments({ workOrderId, className }: CollaborativeCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new comments from other users
      if (Math.random() > 0.8) {
        const newComment: Comment = {
          id: `c${Date.now()}`,
          author: {
            name: ['Jane Smith', 'Mike Wilson', 'Sarah Connor'][Math.floor(Math.random() * 3)],
            role: ['Technician', 'Supervisor', 'Manager'][Math.floor(Math.random() * 3)]
          },
          content: [
            'Just checked the spare parts inventory. We have the required components.',
            'Updated the maintenance schedule to accommodate this repair.',
            'Safety briefing completed with the team.',
            'Quality check passed on the replacement parts.',
            'Coordinating with production to minimize downtime.'
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date().toISOString(),
          type: 'comment',
          likes: 0,
          replies: []
        };

        setComments(prev => [newComment, ...prev]);
        toast.success('New comment added', {
          description: `${newComment.author.name}: ${newComment.content.slice(0, 50)}...`
        });
      }
    }, 20000); // New comment every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: { name: 'Current User', role: 'Maintenance Technician' },
      content: newComment,
      timestamp: new Date().toISOString(),
      type: 'comment',
      likes: 0,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast.success('Comment added successfully');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `r${Date.now()}`,
      author: { name: 'Current User', role: 'Maintenance Technician' },
      content: replyContent,
      timestamp: new Date().toISOString(),
      type: 'comment',
      likes: 0,
      replies: []
    };

    setComments(prev => 
      prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyContent('');
    setReplyTo(null);
    toast.success('Reply added successfully');
  };

  const handleLike = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked 
            }
          : comment
      )
    );
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case 'status_update': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'assignment': return <Users className="w-4 h-4 text-primary" />;
      case 'attachment': return <Paperclip className="w-4 h-4 text-muted-foreground" />;
      default: return <MessageSquare className="w-4 h-4 text-primary" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Collaboration ({comments.length + comments.reduce((sum, c) => sum + c.replies.length, 0)})
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'}`} />
            <span className="text-xs text-muted-foreground">
              {isOnline ? 'Live' : 'Offline'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Comment */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment, update, or note..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="w-4 h-4 mr-2" />
                Attach
              </Button>
            </div>
            <Button onClick={handleAddComment} size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {comment.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getCommentIcon(comment.type)}
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.author.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-2 text-xs">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment.id)}
                      className={`h-6 px-2 ${comment.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(comment.id)}
                      className="h-6 px-2"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {/* Reply Input */}
                  {replyTo === comment.id && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                      />
                      <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2 border-l pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {reply.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted/20 rounded-lg p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs">{reply.author.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-xs">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}