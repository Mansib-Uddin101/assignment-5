let currentTab = "all";
let allIssues = [];
const loadIssues = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then((res) => res.json())
        .then((json) => {
            allIssues = json.data;
            renderIssues();
        });
};

const priorityStyles = {
    high: {
        border: "border-t-[#EF4444]",
        badge: "bg-red-50 text-[#EF4444]"
    },
    medium: {
        border: "border-t-[#F59E0B]",
        badge: "bg-amber-50 text-[#F59E0B]"
    },
    low: {
        border: "border-t-[#94A3B8]",
        badge: "bg-slate-100 text-[#64748B]"
    }
};


function renderIssues() {
    const cardContainer = document.getElementById("issuesContainer");
    cardContainer.innerHTML = '';

    const filteredIssues = allIssues.filter(issue => {
        if (currentTab === 'all') return true;
        return issue.status === currentTab;
    });
    filteredIssues.forEach(issue => {
        const style = priorityStyles[issue.priority] || priorityStyles.low;
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="bg-white border border-slate-200 p-4 rounded-lg flex flex-col gap-3">
            <div class="flex items-center justify-between">
                <img src="assets/${issue.status}-Status.png" alt="">
                <span
                    class="inline-block px-7 py-2 rounded-full bg-red-50 text-[#EF4444] font-medium text-sm tracking-wider
                    ${style.badge}">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
            <div>
                <h3 class="text-lg font-semibold">${issue.title}</h3>
                <p class="text-[#64748B]">${issue.description}</p>
            </div>
            <div class="border-b pb-4 border-slate-200 flex flex-wrap gap-2">
                ${issue.labels.map(label => `
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs uppercase">
                    ${label}
                </span>
            `).join('')}
            </div>
            <div class="flex flex-col gap-2 text-[#64748b] text-sm">
            <p>#${issue.id} by <span class="font-medium">${issue.author}</span></p>
            <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
        </div>
        `;
        cardContainer.appendChild(div);
    });

}
loadIssues()

document.getElementById("tabs").addEventListener("click", function (event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("all")) {
        currentTab = "all";

    }
    else if (clickedElement.classList.contains("open")) {
        currentTab = "open";

    }
    else if (clickedElement.classList.contains("closed")) {
        currentTab = "closed";

    }
    renderIssues();
})
