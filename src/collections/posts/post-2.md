---
title: "Repo-Watch: A GitHub Monitor"
description: Building a monitor for GitHub's public activity
pubDate: 2025-10-28
image:
  url: /assets/images/2025-10-28.png
  alt: Digital illustration of a young man in a dark jacket and blue hoodie standing on a dimly lit city street at night.
tags: [FullStackDevelopment, GitHub, Security, Automation, DevSecOps, APIs]
---
In this post, I'm diving into a new project idea that was born out of a real-world security scare: a dedicated monitoring system for public **GitHub** repositories and users.

## The Problem and its Consequences

Some time ago, a company I worked for discovered that a **former trainee** had copied a customer’s **proprietary source code** to a public repository on GitHub. Detection only occurred because the person included the company's name in the repository title and description.

The obvious consequence of this breach is a **copyright violation**, but the problem leads to broader, severe **reputational damage**. Imagine a scenario where a customer’s source code is leaked, and other clients subsequently find a proliferation of public repositories bearing your company’s name. Even if these later repositories contain no sensitive code, the initial breach establishes a pattern of risk that erodes trust.

## The First Approach

The initial incident was such a serious issue that leadership had to form a **dedicated team** to monitor the situation and prevent recurrence.

The low-tech starting point was to manually search GitHub for repositories containing specific keywords, such as the company’s name. They would manually log all relevant data (repository name, description, owner, and more) into a spreadsheet. With luck, the owner had a publicly visible email address, allowing the team to contact them directly and request the repository’s removal. Otherwise, a formal issue would be raised within the repository itself with the removal request.

## The Second Approach

This is where I came in. Tracking all this information manually was both time-consuming and error-prone due to the human factor. Recognizing this inefficiency, one of the leaders asked me to investigate how we could **automate the retrieval and storage of this information**.

The basic requirement was straightforward: read the **GitHub REST API** documentation and write a simple Command-Line Interface (CLI) tool to pull the data and update the existing spreadsheet. However, I decided to propose a more robust solution and asked for resources, though the project lacked a dedicated budget.

I had to solve the problem anyway, so I replaced the spreadsheet with a file-based **SQLite database** and created a **GitHub Actions workflow** to leverage the CLI. The workflow was triggered every three hours using a **cron expression**. It would retrieve the database artifact from the previous successful run, process it with the CLI, and then re-upload the updated database as a new artifact for the next run. The CLI also sent a report (via my work account) detailing newly discovered repositories and those that had since been taken down.

Was this the best solution? Definitely not. But I solved the core problem in record time, and everyone was happy. The only remaining manual task was the repository removal request, either via email or by posting an issue.

## Looking Ahead: The Next Iteration

While the cron-triggered CLI solved the immediate detection problem, it was a bare-bones hack. It still left the follow-up work manual, and it lacked a proper user interface for the security team to collaborate. I realized this problem deserves a dedicated, **full-stack application**.

My new project idea is to build exactly that: a comprehensive dashboard where security teams can not only discover potential leaks immediately but also track and manage the entire resolution workflow. This means moving beyond a simple database artifact and creating a scalable application that monitors GitHub in near real-time. If you’re interested in seeing how to build a robust, production-ready system for continuous security monitoring, keep an eye on this space. My next post will dive into the architecture and technologies I plan to use!
