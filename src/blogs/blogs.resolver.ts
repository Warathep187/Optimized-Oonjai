import { UpdateBlogInput } from "./dto/update-blog.dto";
import { LoggedInUser } from "./../auth/types/current-user.type";
import { CreateBlogInput } from "./dto/create-blog.dto";
import { DoctorGuard } from "./../auth/guards/doctor.guard";
import { BlogsService } from "./blogs.service";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common/decorators";
import { CurrentUser } from "src/auth/decorators/user.decorator";

@Resolver()
export class BlogsResolver {
    constructor(private blogsService: BlogsService) {}

    @Mutation()
    @UseGuards(DoctorGuard)
    createBlog(
        @CurrentUser() user: LoggedInUser,
        @Args("createBlogInput") createBlogInput: CreateBlogInput,
    ) {
        return this.blogsService.createBlog(user.userId, createBlogInput);
    }

    @Mutation()
    @UseGuards(DoctorGuard)
    updateBlog(
        @CurrentUser() user: LoggedInUser,
        @Args("blogId") blogId: string,
        @Args("updateBlogInput") updateBlogInput: UpdateBlogInput,
    ) {
        return this.blogsService.updateBlog(
            user.userId,
            blogId,
            updateBlogInput,
        );
    }

    @Mutation()
    @UseGuards(DoctorGuard)
    deleteBlog(
        @CurrentUser() user: LoggedInUser,
        @Args("blogId") blogId: string,
    ) {
        return this.blogsService.deleteBlog(user.userId, blogId);
    }

    @Query()
    blogs() {
        return this.blogsService.getAllBlogs();
    }

    @Query()
    topicBlogs(@Args("topicId") topicId: string) {
        return this.blogsService.getTopicBlogs(topicId);
    }

    @Query()
    searchBlogs(@Args("keyword") keyword: string) {
        return this.blogsService.searchBlog(keyword);
    }
}
