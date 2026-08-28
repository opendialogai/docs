---
title: Troubleshooting interpreters
---

## Steps to check when working with a knowledge base

*   Make sure that your knowledge base is working in the NLU service. E.g.

    ![](~/assets/2023-06-16-07-40-11.png)  ![](~/assets/2023-06-16-07-40-37-1.png)

    *   Test your interpreter setup in OD. Note that success in OD doesn't mean that your knowledge base is working; you must check the previous step as well



        ![This image shows the window to run the interpreter test in OD](~/assets/2023-06-16-07-44-00.png "375")

        *Run interpreter test in OD*



        *   Make sure your intent names align and use the names as shown in the image and the documentation. Check that your answer intent has an attribute message per the documentation.

            ![](~/assets/2023-06-16-07-44-00-copy.png)  ![](~/assets/2023-06-16-07-47-08.png)

## Troubleshooting

Q: Everything seems to be working but I get an empty answer in my preview.

![Preview screen showing empty KB answer](~/assets/2023-06-15-14-42-00.png)

*Preview screen showing empty KB answer*

A: The message in the context indicates that everything is working on the OD side, but in the knowledge base the answer is not retrieved. Go to your knowledge base and check that you are getting the answers using the test tool (see section above).
