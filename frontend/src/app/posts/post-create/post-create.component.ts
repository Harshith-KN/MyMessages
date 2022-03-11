import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = "create";
  private postId: string;
  isLoading = false;
  post: Post;

  constructor(public postService:PostsService, public route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') as string;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        }); //|| {id:'cdoncj32',title:'title',content:'some content'};
      } else {
        this.mode = 'create';
        this.postId = null!;
      }
    });
  }

  onAddPost(form: NgForm)
  {
    if(form.invalid)
    {
      return;
    }

    //this.postService.addPost(form.value.title, form.value.content);
    //form.resetForm();

    this.isLoading = true;

    if(this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      console.log("INSIDE ELSE BLOCK");
      this.postService.updatePost (
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    
    form.resetForm();
    
    
  }

}
