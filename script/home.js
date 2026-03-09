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
const active = ["bg-blue-500", "text-white"]
const inactive = ["bg-white", "text-black"]

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
const labelStyles = {
    bug: "bg-red-50 text-[#EF4444]",
    "help wanted": "bg-amber-50 text-[#F59E0B]",
    enhancement: "bg-emerald-50 text-[#10B981]",
    default: "bg-slate-100 text-slate-600"
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
        div.className = "cursor-pointer";
        div.onclick = () => showModal(issue);
        div.innerHTML = `
        <div class="bg-white h-full shadow-md border-t-4 p-4 rounded-lg flex flex-col gap-3 ${issue.status === 'open' ? 'border-green-500' : 'border-purple-700'}">
            <div class="flex items-center justify-between">
                <img src="assets/${issue.status}-Status.png" alt="">
                <span
                    class="inline-block px-7 py-2 rounded-full font-medium text-sm tracking-wider
                    ${style.badge}">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
            <div>
                <h3 class="text-lg font-semibold">${issue.title}</h3>
                <p class="text-[#64748B]">${issue.description}</p>
            </div>
            <div class="border-b pb-4 border-slate-200 flex flex-wrap gap-2">
                ${issue.labels.map(label => {
                const colorClass = labelStyles[label.toLowerCase()] || labelStyles.default;
                return `
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm uppercase border border-current opacity-80 ${colorClass}">
                        ${label}
                    </span>
                `;
            }).join('')}
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

const updateTabUI = (clickedElement) => {
    const tabs = document.querySelectorAll(".tabBtn"); 
    tabs.forEach(tab => {
        tab.classList.remove(...active);
        tab.classList.add(...inactive);
    });
    clickedElement.classList.add(...active);
    clickedElement.classList.remove(...inactive);
};
document.getElementById("tabs").addEventListener("click", function (event) {
    const clickedElement = event.target.closest("button");
    if (!clickedElement) return

    if (clickedElement.classList.contains("all")) {
        currentTab = "all";

    }
    else if (clickedElement.classList.contains("open")) {
        currentTab = "open";

    }
    else if (clickedElement.classList.contains("closed")) {
        currentTab = "closed";

    }
    updateTabUI(clickedElement);
    renderIssues();
})

function showModal(issue) {
    const modal = document.getElementById("issueModal");
    document.getElementById("modalTitle").innerText = issue.title;
    document.getElementById("modalAuthor").innerText = issue.author;
    document.getElementById("modalDescription").innerText = issue.description;
    document.getElementById("modalAssignee").innerText = issue.assignee || "Unassigned";
    document.getElementById("modalDate").innerText = new Date(issue.createdAt).toLocaleDateString();

    const statusEl = document.getElementById("modalStatus");
    statusEl.innerText = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
    statusEl.className = `px-4 py-1 rounded-full text-white font-semibold text-sm ${issue.status === 'open' ? 'bg-[#00AC69]' : 'bg-purple-600'}`;

    const prioElement = document.getElementById("modalPriority");
    const style = priorityStyles[issue.priority] || priorityStyles.low;
    prioElement.innerText = issue.priority.toUpperCase();
    prioElement.className = `inline-block px-6 py-1 rounded-full font-bold text-xs tracking-widest ${style.badge}`;

    const labelContainer = document.getElementById("modalLabels");
    labelContainer.innerHTML = issue.labels.map(label => {
        const colorClass = labelStyles[label.toLowerCase()] || labelStyles.default;
        return `<span class="px-3 py-1 rounded-full font-bold uppercase border border-current ${colorClass}">${label}</span>`;
    }).join('');

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function closeModal() {
    const modal = document.getElementById("issueModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}