export const getFinalTabStatus = data => {
    return data.filter(item => item.currentState === "Completed" && item.name ==="Final Update").length === 1
}

export const filterTasks = data => {
    const result = data.map(item => {
        if(item.name === "Partner Information") {
            return {
                ...item,
                sortOrder: 1,
            }
        } else if(item.name === "Co-Workers" && (item.currentState ==="Active" || item.currentState === "Completed")) {
            return {
                ...item,
                sortOrder: 2,
            }
        } else if(item.name === "Co-Worker Information") {
            return {
                ...item,
                sortOrder: 3,
            }
        } else if(item.name === "Billing Information") {
            return {
                ...item,
                sortOrder: 4,
            }
        } else if(item.name === "Header Color") {
            return {
                ...item,
                sortOrder: 5,
            }
        } else if(item.name === "Partner Labels") {
            return {
                ...item,
                sortOrder: 6,
            }
        } else if(item.name === "Final Update") {
            return {
                ...item,
                sortOrder: 7,
            }
        } else {
            return {
                ...item,
                sortOrder: 0
            }
        }
    }).filter(item => item.currentState === "Active" && item.type === "HumanTask" || item.name === "Co-Workers" || item.name === "Final Update").sort((a,b) => a.sortOrder-b.sortOrder);
    return result;
}

export const getCoworkerData = data => {
    const result = data.filter(item => item.name === "Co-Worker Information1");
    return result;
}