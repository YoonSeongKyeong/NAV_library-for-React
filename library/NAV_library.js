// <NAV_Library> by 윤성경 YoonSeongKyeong

// 이 library를 사용하면 리스트를 아무리 추가해도 브라우저의 영역을 뚫고 리스트가 나가는 일이 없게 됩니다.

// React로 TODOLIST를 만들다가 Nav, completedNav, TodoNav의 중복된 코드를 function으로 정리하면서 만들었습니다.
// index 기반으로 Navigation을 구현했습니다. 시작 index 부터 한 페이지의 리스트 갯수만큼 보여줍니다.
// input은 보통 현재 리스트 갯수, 한 페이지당 리스트 갯수, 현재 시작index 입니다.
// output은 보통 다음 시작 index입니다. 
// (시작 index <= 현재 페이지의 리스트 < 뒤쪽 경계 index)
// array에서 render할 리스트의 인덱스 범위만큼 slice해서 사용합니다. 사용예시: (render안에서) {myLists.slice(this.startIndex, this.getlastIndex(...)).map((listObj)=>(<Component.../>))}
// 다음 시작 index가 현재 시작 index와 같다면 시작 index에 대해 setState를 안해도 괜찮고 다르다면 setState로 바꿔줘야 합니다.
// 페이지는 1페이지부터 시작합니다.

// ***기능*** 
// 1. 마지막 페이지 계산하기
// 2. 현재 페이지 계산하기
// 3. 현재 페이지에 포함되지 않는 뒤쪽 경계 인덱스 구하기 
// 4. 리스트 하나를 더한 경우 시작 인덱스 구하기 (더했을 때 더해진 페이지로 focus)
// 5. 리스트 하나를 빼는 경우 시작 인덱스 구하기 (마지막 페이지가 사라지는 경우를 handle)
// 6. prev 버튼이 눌린 후의 시작 인덱스 구하기
// 7. next 버튼이 눌린 후의 시작 인덱스 구하기

// import {NAV_getLastPage, NAV_getCurrentPage, NAV_getLastBoundaryIndex, NAV_getStartIndexAfterAdd, NAV_getStartIndexAfterDelete, NAV_getStartIndexOfPrev, NAV_getStartIndexOfNext} from '경로 of NAV_library' 

export function NAV_getLastPage(numOfLists, listsPerPage) {// (현재 리스트 갯수, 한 페이지당 리스트 갯수) => 마지막 페이지
    return Math.floor((numOfLists - 1) / listsPerPage) + 1;
}

export function NAV_getCurrentPage(listsPerPage, startIndex) {// (한 페이지당 리스트 갯수, 현재 시작index) => 현재 페이지
    return (startIndex / listsPerPage) + 1
}

export function NAV_getLastBoundaryIndex(numOfLists, listsPerPage, startIndex) {// (현재 리스트 갯수, 한 페이지당 리스트 갯수, 현재 시작index) => 뒤쪽 경계 index <slice의 argument로 사용>
    return (numOfLists > (startIndex + listsPerPage) ? (startIndex + listsPerPage) : numOfLists)
}

export function NAV_getStartIndexAfterAdd(numOfLists, listsPerPage) {//(현재 리스트 갯수, 한 페이지당 리스트 갯수) => 추가한 뒤의 시작 인덱스
    return (numOfLists % listsPerPage === 0 ? numOfLists : listsPerPage * (Math.floor((numOfLists - 1) / listsPerPage)))
}

export function NAV_getStartIndexAfterDelete(numOfLists, listsPerPage, startIndex) {// (현재 리스트 갯수, 한 페이지당 리스트 갯수, 현재 시작 index) => 제거한 뒤의 시작 인덱스
    return (numOfLists === startIndex + 1 ? startIndex - listsPerPage : startIndex)
}

export function NAV_getStartIndexOfPrev(listsPerPage, startIndex) {//(한 페이지당 리스트 갯수, 현재 시작 인덱스) => prev버튼이 눌린 후의 시작 인덱스
    return (startIndex > 0 ? startIndex - listsPerPage : startIndex)
}

export function NAV_getStartIndexOfNext(numOfLists, listsPerPage, startIndex) {//(현재 리스트 갯수, 한 페이지당 리스트 갯수, 현재 시작 index) => next버튼이 눌린 후의 시작 인덱스
    return (startIndex + listsPerPage < numOfLists ? startIndex + listsPerPage : startIndex)

}