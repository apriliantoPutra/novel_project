import { createRouter, createWebHistory } from "vue-router";

// layout
import MainLayout from "../layouts/MainLayout.vue"
import AdminLayout from "../layouts/AdminLayout.vue"
import AuthorLayout from "../layouts/AuthorLayout.vue"

// pages
import HomePage from "../pages/Home.vue"
import NovelListPage from "../pages/novels/NovelList.vue"
import NovelDetailPage from "../pages/novels/NovelDetail.vue"
import ChapterDetailPage from "../pages/novels/ChapterDetail.vue"
import DashboardAdminPage from "../pages/admin/Dashboard.vue"
import UserListPage from "../pages/admin/user/UserList.vue"
import UserCreatePage from "../pages/admin/user/UserCreate.vue"
import UserEditPage from "../pages/admin/user/UserEdit.vue"
import UserDetailPage from "../pages/admin/user/UserDetail.vue"
import GenrePage from "../pages/admin/Genre.vue"
import NovelListAdminPage from "../pages/admin/novel/NovelList.vue"
import NovelCreateAdminPage from "../pages/admin/novel/NovelCreate.vue"
import NovelEditAdminPage from "../pages/admin/novel/NovelEdit.vue"
import NovelDetailAdminPage from "../pages/admin/novel/NovelDetail.vue"
import ChapterListAdminPage from "../pages/admin/novel/ChapterList.vue"
import ChapterCreateAdminPage from "../pages/admin/novel/ChapterCreate.vue"
import ChapterEditAdminPage from "../pages/admin/novel/ChapterEdit.vue"
import ChapterDetailAdminPage from "../pages/admin/novel/ChapterDetail.vue"
import DashboardAuthorPage from "../pages/author/Dashboard.vue"
import NovelListAuthorPage from "../pages/author/novel/NovelList.vue"
import NovelCreateAuthorPage from "../pages/author/novel/NovelCreate.vue"
import NovelEditAuthorPage from "../pages/author/novel/NovelEdit.vue"
import NovelDetailAuthorPage from "../pages/author/novel/NovelDetail.vue"
import ChapterListAuthorPage from "../pages/author/novel/ChapterList.vue"
import ChapterCreateAuthorPage from "../pages/author/novel/ChapterCreate.vue"
import ChapterEditAuthorPage from "../pages/author/novel/ChapterEdit.vue"
import ChapterDetailAuthorPage from "../pages/author/novel/ChapterDetail.vue"

import LoginPage from "../pages/auth/Login.vue"
import RegisterPage from "../pages/auth/Register.vue"
import NotFound from "../pages/NotFound.vue"


const routes= [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: "",
                name: "Home",
                component: HomePage
            },
            {
                path: "/novels",
                name: "NovelList",
                component: NovelListPage
            },
            {
                path: "/novel-detail/:id",
                name: "NovelDetail",
                component: NovelDetailPage,
                props: true

            },
            {
                path: "/chapter-detail/:id",
                name: "ChapterDetail",
                meta: {requiresAuth: true, role: 'reader'},
                component: ChapterDetailPage,
                props: true
            },
        ]
    },
    {
        path: '/admin',
        component: AdminLayout,
        meta: {requiresAuth: true, role: 'admin'},
        children: [
            {
                path: '',
                name: 'DashboardAdmin',
                component: DashboardAdminPage
            },
            {
                path: '/user-list',
                name: 'UserList',
                component: UserListPage
            },
            {
                path: '/user-create',
                name: 'UserCreate',
                component: UserCreatePage
            },
            {
                path: '/user-edit/:id',
                name: 'UserEdit',
                props: true,
                component: UserEditPage
            },
            {
                path: '/user-detail/:id',
                name: 'UserDetail',
                props: true,
                component: UserDetailPage
            },
            {
                path: '/genre',
                name: 'Genre',
                component: GenrePage
            },

            // novel
            {
                path: '/novel-admin-list',
                name: 'NovelAdminList',
                component: NovelListAdminPage
            },
            {
                path: '/novel-admin-create',
                name: 'NovelAdminCreate',
                component: NovelCreateAdminPage
            },
            {
                path: '/novel-admin-edit/:id',
                name: 'NovelAdminEdit',
                component: NovelEditAdminPage,
                props: true
            },
            {
                path: '/novel-admin-detail/:id',
                name: 'NovelAdminDetail',
                component: NovelDetailAdminPage,
                props: true
            },

            // chapter
            {
                path: '/chapter-admin-list/:novelId',
                name: 'ChapterAdminList',
                component: ChapterListAdminPage,
                props: true
            },
            {
                path: '/chapter-admin-create/:novelId',
                name: 'ChapterAdminCreate',
                component: ChapterCreateAdminPage,
                props: true
            },
            {
                path: '/chapter-admin-edit/:id',
                name: 'ChapterAdminEdit',
                component: ChapterEditAdminPage,
                props: true
            },
            {
                path: '/chapter-admin-detail/:id',
                name: 'ChapterAdminDetail',
                component: ChapterDetailAdminPage,
                props: true
            },

        ]
    },
    {
        path: '/author',
        component: AuthorLayout,
        meta: {requiresAuth: true, role: 'author'},
        children: [
            {
                path: '',
                name: 'DashboardAuthor',
                component: DashboardAuthorPage
            },

            // novel
            {
                path: '/novel-author-list',
                name: 'NovelAuthorList',
                component: NovelListAuthorPage
            },
            {
                path: '/novel-author-create',
                name: 'NovelAuthorCreate',
                component: NovelCreateAuthorPage
            },
            {
                path: '/novel-author-edit/:id',
                name: 'NovelAuthorEdit',
                component: NovelEditAuthorPage,
                props: true
            },
            {
                path: '/novel-author-detail/:id',
                name: 'NovelAuthorDetail',
                component: NovelDetailAuthorPage,
                props: true
            },

            // chapter
            {
                path: '/chapter-author-list/:novelId',
                name: 'ChapterAuthorList',
                component: ChapterListAuthorPage,
                props: true
            },
            {
                path: '/chapter-author-create/:novelId',
                name: 'ChapterAuthorCreate',
                component: ChapterCreateAuthorPage,
                props: true
            },
            {
                path: '/chapter-author-edit/:id',
                name: 'ChapterAuthorEdit',
                component: ChapterEditAuthorPage,
                props: true
            },
            {
                path: '/chapter-author-detail/:id',
                name: 'ChapterAuthorDetail',
                component: ChapterDetailAuthorPage,
                props: true
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },


]
const router= createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next)=> {
    const token= localStorage.getItem('token')
    const user= JSON.parse(localStorage.getItem('user'))
    if ((to.name === 'Home' || to.name === 'Login') &&  token && user){
        if(user.role === 'admin'){
            return next({name: 'DashboardAdmin'})
        }
        if(user.role === 'author'){
            return next({name: 'DashboardAuthor'})
        }

        return next()
    }

    if (to.meta.requiresAuth && !token){
        return next({
            name: 'Login',
            query: {message: 'Silakan login terlebih dahulu untuk melanjutkan.'}
        })
    }
    if(to.meta.role && user?.role !== to.meta.role){
        return next({ 
            name: 'Login',
            query: { message: 'Akses ditolak! Role kamu tidak diizinkan ke halaman ini.'}
        })
    }
    next()
})

export default router