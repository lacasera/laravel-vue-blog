import Vuex from 'vuex'
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate';
import BlogForm from '@/components/blog/BlogForm'
import TestHelpers from '@/test/test-helpers'
import flushPromises from 'flush-promises'
// import { state, getters, mutations, actions } from '@/store/modules/blog'
// import {
//     state as category_state,
//     getters as category_getters,
//     mutations as category_mutations,
//     actions as category_actions
// } from '@/store/modules/category'

import Editor from '@/components/blog/Editor'
import Error from '@/components/Error'

const categories = [
    {
        id: 1,
        name: "Laravel",
        slug: "laravel",
        created_at: "2019-02-27 20:36:44",
        updated_at: "2019-02-27 20:36:44"
    },
    {
        id: 2,
        name: "Vue",
        slug: "vue",
        created_at: "2019-02-27 20:36:44",
        updated_at: "2019-02-27 20:36:44"
    },
]

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(VeeValidate)
const router = new VueRouter()

describe('BlogForm', () => {
    let store
    let wrapper
    let h

    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                blog: {
                    namespaced: true,
                    actions: {
                        saveBlog: jest.fn(),
                        updateBlog: jest.fn(),
                    }
                },
                category: {
                    namespaced: true,
                    state: {
                        categories
                    },
                    getters: {
                        categories: (state) => state.categories
                    },
                    actions: {
                        getCategories: jest.fn
                    }
                }
            }
        })
        wrapper = shallowMount(BlogForm, {
            sync: false,
            localVue,
            store,
            router,
            stubs: {
                Editor: '<textarea type="text" name="editor"></textarea>',
                Error
            },
            propsData: {
                type: 'new',
                slug: 'foo-bar'
            }
        })

        h = new TestHelpers(wrapper, expect)
    })

    it('can get all categories', () => {
        expect(wrapper.vm.categories.length).toBe(2)
    })

    describe('Validate', () => {
        it('title is null', async () => {
            expect(wrapper.vm.errors.has("title")).toBe(false);
            wrapper.setData({
                blog: {
                    title: 'init title is not null'
                }
            })

            await flushPromises()
            let title = h.find('input[name="title"]')
            title.setValue("")
            title.trigger('blur')

            await flushPromises()
            expect(wrapper.vm.errors.has("title")).toBe(true);

        })

        it('body is null', async () => {
            expect(wrapper.vm.errors.has("body")).toBe(false);
            wrapper.setData({body: 'init body is not null'})

            await flushPromises()
            let body = h.find('input[name="body"]')
            body.setValue("")
            body.trigger('blur')

            await flushPromises()
            expect(wrapper.vm.errors.has("body")).toBe(true);

        })

        it('body has less than three characters', async () => {
            expect(wrapper.vm.errors.has("body")).toBe(false);

            wrapper.setData({body: 'as'})

            await flushPromises()
            expect(wrapper.vm.errors.has("body")).toBe(true);
        })

        it('title has less than three characters', async () => {
            expect(wrapper.vm.errors.has("title")).toBe(false);

            wrapper.setData({
                blog: {
                    title: 'as'
                }
            })

            await flushPromises()
            expect(wrapper.vm.errors.has("title")).toBe(true);
        })

        it('category is null', async () => {
            expect(wrapper.vm.errors.has("category")).toBe(false);
            wrapper.setData({
                blog: {
                    category_id: 1
                }
            })

            let category = h.find('select[name="category"]')
            category.setValue(0)
            category.trigger('blur')

            await flushPromises()
            expect(wrapper.vm.errors.has("category")).toBe(true);
        })

    })

    describe('can save', () => {
        beforeEach(() => {
            wrapper.setData({
                formType: 'new',
            })
        })

        it('a new blog', async () => {
            wrapper.setData({
                blog: {
                    title: 'foo bar',
                    body: 'Lorem upsum',
                    category_id: 1,
                    cover_image: '',
                    publish: true,
                },
                body: 'Lorem upsum'
            })

            await flushPromises()
            let save = h.find("[data-save]")
            save.trigger('click')

            expect(wrapper.vm.errors.count()).toBe(0)

            await flushPromises()

            expect(wrapper.vm.$data.blog).toEqual({
                title: '',
                body: '',
                category_id:'',
                cover_image: ''
            })
        })
    })

    describe('can update', () => {
        beforeEach(() => {
            wrapper.setData({
                formType: 'edit',
                slug: 'foo-bar'
            })
        })

        it('an existing blog', async () => {
            wrapper.setData({
                blog: {
                    title: 'foo bar',
                    body: 'Lorem upsum',
                    category_id: 1,
                    cover_image: '',
                    publish: true,
                    _method: ''
                },
                body: 'Lorem upsum'
            })

            await flushPromises()
            let update = h.find("[data-update]")
            h.find('input[name="title"]').setValue('bar baz')
            h.find('select[name="category"]').setValue(2)
            update.trigger('click')

            expect(wrapper.vm.errors.count()).toBe(0)

            await flushPromises()

            expect(wrapper.vm.$data.blog).toEqual({
                title: 'bar baz',
                body: 'Lorem upsum',
                category_id: 2,
                cover_image: '',
                publish: true,
                _method: 'PUT'
            })
        })
    })
})