// 원래는 카테고리 Navigation function 안에서 복잡한 로직을 다 구현했기 때문에 if문이 복잡했습니다.
// 하지만 NAV library를 사용해서 
// if(startIndex!==nextStartIndex){this.setState({startIndex:nextStartIndex})}같은 간단한 로직으로 
// 쉽게 Navigation 기능을 구현할 수 있게 해줍니다. 
// 함수 안이 복잡해 보이지만 [다음 startIndex를 받고] [현재와 다르면 setState]하는 일관적인 로직으로 구성됩니다.

import React, { Component } from 'react'
import CategoryLabel from "./CategoryLabel"
import CategoryAdd from "./CategoryAdd"
import {NAV_getLastPage, NAV_getCurrentPage, NAV_getLastBoundaryIndex, NAV_getStartIndexAfterAdd, NAV_getStartIndexAfterDelete, NAV_getStartIndexOfPrev, NAV_getStartIndexOfNext} from '../library/NAV_library' 

class Nav extends Component {
    constructor(props) {
        super(props)
        this.maxNumOfCategoryPerPage=8
        this.state = {
            categoryStartIndex: 0
        }
        this.getLastPage = this.getLastPage.bind(this)
        this.renderCategories = this.renderCategories.bind(this)
        this.handleCategoryDelete = this.handleCategoryDelete.bind(this)
        this.handleCategoryAdd = this.handleCategoryAdd.bind(this)
        this.handleCategoryPrev = this.handleCategoryPrev.bind(this)
        this.handleCategoryNext = this.handleCategoryNext.bind(this)
    }

    getLastPage() {
        const numOFCategories = this.props.categoryList.length
        const allowedNumPerPage = this.maxNumOfCategoryPerPage
        return NAV_getLastPage(numOFCategories, allowedNumPerPage)
    }

    renderCategories() {//보여줄 카테고리의 object list를 array로 반환합니다.
        const startIndex = this.state.categoryStartIndex
        const numOFCategories = this.props.categoryList.length
        const allowedNumPerPage = this.maxNumOfCategoryPerPage
        const lastBound = NAV_getLastBoundaryIndex(numOFCategories, allowedNumPerPage, startIndex)
        return this.props.categoryList.slice(startIndex, lastBound)
    }

    handleCategoryDelete(categoryId) {//카테고리를 지워서 마지막 페이지가 비는 경우를 handle
        const superDelete = this.props.handleCategoryDelete;
        const startIndex = this.state.categoryStartIndex
        const numOFCategories = this.props.categoryList.length
        const allowedNumPerPage = this.maxNumOfCategoryPerPage
        const startIndexAfterDelete = NAV_getStartIndexAfterDelete(numOFCategories, allowedNumPerPage, startIndex)
        if(startIndex !== startIndexAfterDelete) {//ex 9개에서 1개 지우는데 한 페이지 표시가능 갯수가 8개인 경우 + 현재가 마지막 페이지인 경우
            this.setState({categoryStartIndex: startIndexAfterDelete})//이전페이지로 돌아간다
        }
        superDelete(categoryId)//원래 지우는 기능
    }

    handleCategoryAdd(newCategoryName, newcategoryId) {//카테고리를 더했을 때 더해진 카테고리가 속한 페이지로 가는 기능
        const superAdd = this.props.handleCategoryAdd;
        const numOFCategories = this.props.categoryList.length
        const allowedNumPerPage = this.maxNumOfCategoryPerPage
        const startIndex = this.state.categoryStartIndex
        const startIndexAfterAdd = NAV_getStartIndexAfterAdd(numOFCategories, allowedNumPerPage)
        if(startIndex !== startIndexAfterAdd ) {//ex 현재 8*n개인데 한페이지 표시가능 갯수가 8개라서 하나 더하면 새로운 페이지에 나오는 경우
            this.setState({categoryStartIndex: startIndexAfterAdd})// 새로운 페이지로 간다.
        }
        superAdd(newCategoryName, newcategoryId)//원래 더하는 기능
    }

    handleCategoryPrev() {
        const startIndex = this.state.categoryStartIndex
        const allowedNumPerPage = this.maxNumOfCategoryPerPage
        const startIndexAfterPrev = NAV_getStartIndexOfPrev(allowedNumPerPage,startIndex)
        if(startIndex!==startIndexAfterPrev) {//이전 페이지가 존재하면
            this.setState({categoryStartIndex: startIndexAfterPrev})//이전 페이지로 돌아간다.
        }
    }

    handleCategoryNext() {
        const startIndex = this.state.categoryStartIndex
        const numOFCategories = this.props.categoryList.length
        const allowedNumPerPage = this.maxNumOfCategoryPerPage
        const startIndexAfterNext = NAV_getStartIndexOfNext(numOFCategories, allowedNumPerPage, startIndex)
        if(startIndex !== startIndexAfterNext) {//다음 페이지에 표시할 게 있다면
            this.setState({categoryStartIndex: startIndexAfterNext})//다음 페이지로 넘어간다.
        }
    }

    render() {
        const nav = this;
        return (
            <div>
                {
                    this.renderCategories().map(categoryObject => (
                        <CategoryLabel
                            key={categoryObject.categoryId}
                            categoryName={categoryObject.categoryName}
                            categoryObject={categoryObject}
                            handleCategorySelect={this.props.handleCategorySelect}
                            handleCategoryDelete={this.handleCategoryDelete}
                        />
                    ))
                }
                <CategoryAdd
                    handleCategoryAdd={this.handleCategoryAdd}
                />
                <div>
                    <button onClick={this.handleCategoryPrev} >{`prev`}</button>
                    {`${NAV_getCurrentPage(nav.maxNumOfCategoryPerPage, nav.state.categoryStartIndex)}번째 페이지 / ${this.getLastPage()}`}
                    <button onClick={this.handleCategoryNext} >{`next`}</button>
                </div>
            </div>
        )
    }
}

export default Nav