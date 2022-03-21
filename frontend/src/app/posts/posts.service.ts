import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    return this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/posts' + queryParams)
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/posts/'+id);
  }

  updatePost(id: string, title: string, content: string, image: File | string | any) {
    // @ts-ignore: Object is possibly 'null'.
    //const post: Post = {id: id, title: title, content: content, imagePath: null};

    let postData: Post | FormData;

    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title',title);
      postData.append('content',content);
      postData.append('image', image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image};
    }
    this.http.put("http://localhost:3000/posts/"+ id, postData)
      .subscribe(response => {
        /*const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {id: id, title: title, content: content, imagePath: ""};
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);*/
        this.router.navigate([""]);
      });
  }

  addPost(title:string, content:string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    //    const id='';
    this.http.post<{message: string, post: Post}>('http://localhost:3000/posts', postData)
      .subscribe((responseData) => {
        //console.log(responseData.message);
        //const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
        //const id = responseData.post.id;
        //post.id = id;
        //this.posts.push(post);
        //this.postsUpdated.next([...this.posts]);
        this.router.navigate(['']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/posts/'+postId);
  }
}
