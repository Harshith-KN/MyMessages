import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  postService:PostsService;

  Posts: Post[]=[];
  isLoading = false;
  private postsSub: Subscription;

  constructor(postService:PostsService) { 
    this.postService=postService;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.Posts=posts;
      });
  }

  /*@Input() Posts = [
    {title:'First Post',content:'Content of First Post'},
    {title:'Second Post',content:'Content of 2nd Post'},
    {title:'Third Post',content:'Content of 3rd Post'},
    {title:'Fourth Post',content:'Content of 4th Post'},
  ]*/

  onDelete(postId: any) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
